import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { Octokit } from "@octokit/core";
import postgres from "postgres";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

const sql = postgres(process.env.ZERO_UPSTREAM_DB as string);

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;
const AUTH_SECRET = process.env.ZERO_AUTH_SECRET as string;

async function getGithubAccessToken(code: string): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description || "Failed to get access token");
  }

  return data.access_token;
}

async function getGitHubEmails(octokit: Octokit) {
  const emailResponse = await octokit.request("GET /user/emails", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  // Get primary email
  const primaryEmail = emailResponse.data.find(
    (email: any) => email.primary === true,
  );

  return primaryEmail?.email || emailResponse.data[0]?.email;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // state contains our redirect URL

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    // Exchange code for access token
    const accessToken = await getGithubAccessToken(code);

    // Get user details from GitHub
    const octokit = new Octokit({
      auth: accessToken,
    });

    const userDetails = await octokit.request("GET /user", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    // Check if user exists in database
    let userId = v4();
    const existingUserId =
      await sql`SELECT id FROM "user" WHERE "github_id" = ${userDetails.data.id}`;

    if (existingUserId.length > 0) {
      userId = existingUserId[0].id;
    } else {
      // In your main callback function, after getting user details:
      const email = await getGitHubEmails(octokit);

      // Create new user
      await sql`INSERT INTO "user"
        ("id", "username", "name", "avatar", "github_id", "email") VALUES (
          ${userId},
          ${userDetails.data.login},
          ${userDetails.data.name},
          ${userDetails.data.avatar_url},
          ${userDetails.data.id},
          ${email}
        )`;
    }

    // Get user role
    const userRows = await sql`SELECT * FROM "user" WHERE "id" = ${userId}`;

    // Create JWT
    const jwtPayload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      role: userRows[0].role,
      name: userDetails.data.login,
    };

    const jwt = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30days")
      .sign(new TextEncoder().encode(AUTH_SECRET));

    // Set cookie
    cookies().set("jwt", jwt, {
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Redirect to specified page or home
    const redirectUrl = state || "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
