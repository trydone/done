/* eslint-disable no-console */
import {Octokit} from '@octokit/core'
import {decodeJwt, SignJWT} from 'jose'
import {cookies} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import postgres from 'postgres'
import {v4} from 'uuid'

const sql = postgres(process.env.ZERO_UPSTREAM_DB as string)

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string
const AUTH_SECRET = process.env.ZERO_AUTH_SECRET as string

async function getGithubAccessToken(code: string): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error_description || 'Failed to get access token')
  }

  return data.access_token
}

async function getGitHubEmails(octokit: Octokit) {
  const emailResponse = await octokit.request('GET /user/emails', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  // Get primary email
  const primaryEmail = emailResponse.data.find(
    (email: any) => email.primary === true,
  )

  return primaryEmail?.email || emailResponse.data[0]?.email
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state') // state contains our redirect URL

  if (!code) {
    return NextResponse.json({error: 'No code provided'}, {status: 400})
  }

  try {
    // Exchange code for access token
    const accessToken = await getGithubAccessToken(code)

    // Get user details from GitHub
    const octokit = new Octokit({
      auth: accessToken,
    })

    const userDetails = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    // Get primary email
    const email = await getGitHubEmails(octokit)

    if (!email) {
      return NextResponse.json(
        {error: 'No email found in GitHub account'},
        {status: 400},
      )
    }

    // Check if account already exists
    const existingAccount = await sql`
      SELECT user_id FROM "account" 
      WHERE provider = 'github' AND provider_user_id = ${userDetails.data.id}
    `

    let userId: string
    if (existingAccount.length > 0) {
      userId = existingAccount[0]?.user_id
    } else {
      const existingUser = await sql`
        SELECT id FROM "user" WHERE email = ${email}
      `

      if (existingUser[0]?.id) {
        userId = existingUser[0].id
      } else {
        userId = v4()
        await sql`
          INSERT INTO "user" ("id", "username", "email", "role") 
          VALUES (
            ${userId},
            ${userDetails.data.login},
            ${email},
            'user'
          )
        `

        await sql`
          INSERT INTO "profile" ("id", "user_id", "name", "avatar") 
          VALUES (
            ${v4()},
            ${userId},
            ${userDetails.data.name || userDetails.data.login},
            ${userDetails.data.avatar_url}
          )
        `
      }

      await sql`
        INSERT INTO "account" (
          "id", 
          "user_id", 
          "provider", 
          "provider_user_id", 
          "email", 
          "access_token", 
          "refresh_token", 
          "token_expiry"
        ) VALUES (
          ${v4()},
          ${userId},
          'github',
          ${userDetails.data.id},
          ${email},
          ${accessToken},
          NULL,
          NULL
        )
      `
    }

    // Handle session creation/lookup
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')
    let sessionId = v4()

    if (token) {
      const payload = decodeJwt(token.value)
      const currentTime = Date.now()
      if (payload.exp && payload.exp >= currentTime && payload.sub) {
        sessionId = payload.sub
      }
    }

    // Check for existing session
    const existingSessionId =
      await sql`SELECT id FROM "session" WHERE "id" = ${sessionId} AND "user_id" = ${userId}`

    if (existingSessionId.length === 0) {
      await sql`
         INSERT INTO "session" ("id", "user_id")
         VALUES (${sessionId}, ${userId})
       `
    }

    // Get user role and create JWT
    const userRows = await sql`SELECT * FROM "user" WHERE "id" = ${userId}`
    const jwtPayload = {
      sub: sessionId,
      iat: Math.floor(Date.now() / 1000),
      role: userRows[0]?.role || 'user',
      name: userDetails.data.login,
    }

    const jwt = await new SignJWT(jwtPayload)
      .setProtectedHeader({alg: 'HS256'})
      .setExpirationTime('30days')
      .sign(new TextEncoder().encode(AUTH_SECRET))

    // Set cookie
    cookieStore.set('jwt', jwt, {
      path: '/',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })

    // Redirect
    const redirectUrl = state ? decodeURIComponent(state) : '/'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({error: 'Authentication failed'}, {status: 500})
  }
}
