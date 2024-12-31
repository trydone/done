import { NextRequest } from "next/server";
import postgres from "postgres";
import { Octokit } from "@octokit/core";
import { SignJWT } from "jose";
import { setCookie } from "cookies-next/server";

const sql = postgres(process.env.ZERO_UPSTREAM_DB as string);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const redirectUrl = searchParams.get("redirect");

  if (!code) {
    // Initial OAuth redirect
    const githubAuthUrl =
      `https://github.com/login/oauth/authorize?` +
      new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: `${request.nextUrl.origin}/api/login/github/callback${
          redirectUrl ? `?redirect=${redirectUrl}` : ""
        }`,
        scope: "read:user user:email",
      });

    return Response.redirect(githubAuthUrl);
  }

  // Exchange code for access token
  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  const octokit = new Octokit({
    auth: tokenData.access_token,
  });

  const userDetails = await octokit.request("GET /user", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  let userId = crypto.randomUUID();
  const existingUserId =
    await sql`SELECT id FROM "user" WHERE "githubID" = ${userDetails.data.id}`;

  if (existingUserId.length > 0) {
    userId = existingUserId[0].id;
  } else {
    await sql`INSERT INTO "user"
      ("id", "login", "name", "avatar", "githubID") VALUES (
        ${userId},
        ${userDetails.data.login},
        ${userDetails.data.name},
        ${userDetails.data.avatar_url},
        ${userDetails.data.id}
      )`;
  }

  const userRows = await sql`SELECT * FROM "user" WHERE "id" = ${userId}`;

  const jwtPayload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    role: userRows[0].role,
    name: userDetails.data.login,
  };

  const jwt = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30days")
    .sign(new TextEncoder().encode(process.env.ZERO_AUTH_SECRET));

  // Create response with redirect
  const response = Response.redirect(
    redirectUrl ? decodeURIComponent(redirectUrl) : new URL("/", request.url)
  );

  // Set cookie
  setCookie("jwt", jwt, {
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return response;
}
