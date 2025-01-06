/* eslint-disable no-console */
import {decodeJwt, SignJWT} from 'jose'
import {cookies} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import postgres from 'postgres'
import {v4} from 'uuid'

const sql = postgres(process.env.ZERO_UPSTREAM_DB as string)

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string
const AUTH_SECRET = process.env.ZERO_AUTH_SECRET as string

async function getGoogleAccessToken(code: string): Promise<{
  access_token: string
  id_token: string
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    }),
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error_description || 'Failed to get access token')
  }

  return {
    access_token: data.access_token,
    id_token: data.id_token,
  }
}

async function getGoogleUserDetails(idToken: string) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`,
  )
  const userDetails = await response.json()

  return {
    email: userDetails.email,
    name: userDetails.name,
    avatar: userDetails.picture,
    googleId: userDetails.sub,
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.json({error: 'No code provided'}, {status: 400})
  }

  try {
    // Exchange code for access token
    const {access_token: accessToken, id_token: idToken} =
      await getGoogleAccessToken(code)

    // Get user details from Google
    const userDetails = await getGoogleUserDetails(idToken)

    if (!userDetails.email) {
      return NextResponse.json(
        {error: 'No email found in Google account'},
        {status: 400},
      )
    }

    // Check if account already exists
    const existingAccount = await sql`
      SELECT user_id FROM "account" 
      WHERE provider = 'google' AND provider_user_id = ${userDetails.googleId}
    `

    let userId: string
    if (existingAccount.length > 0) {
      userId = existingAccount[0]?.user_id
    } else {
      const existingUser = await sql`
        SELECT id FROM "user" WHERE email = ${userDetails.email}
      `

      if (existingUser[0]?.id) {
        userId = existingUser[0].id
      } else {
        userId = v4()
        await sql`
          INSERT INTO "user" ("id", "username", "email", "role") 
          VALUES (
            ${userId},
            ${userDetails.email.split('@')[0]},
            ${userDetails.email},
            'user'
          )
        `

        await sql`
          INSERT INTO "profile" ("id", "user_id", "name", "avatar") 
          VALUES (
            ${v4()},
            ${userId},
            ${userDetails.name},
            ${userDetails.avatar}
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
          'google',
          ${userDetails.googleId},
          ${userDetails.email},
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
      name: userDetails.name,
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
