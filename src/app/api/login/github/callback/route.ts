import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const redirectParam = request.nextUrl.searchParams.get("redirect");

  // Redirect to the main GitHub login handler with the code
  return Response.redirect(
    `${request.nextUrl.origin}/api/login/github?code=${code}${
      redirectParam ? `&redirect=${redirectParam}` : ""
    }`,
  );
}
