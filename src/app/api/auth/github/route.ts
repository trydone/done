import {NextRequest, NextResponse} from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const redirect = searchParams.get('redirect')

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
  githubAuthUrl.searchParams.append('client_id', GITHUB_CLIENT_ID)
  githubAuthUrl.searchParams.append('scope', 'read:user user:email')

  if (redirect) {
    githubAuthUrl.searchParams.append('state', redirect)
  }

  return NextResponse.redirect(githubAuthUrl.toString())
}
