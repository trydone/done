import { decodeJwt, SignJWT, jwtVerify, JWTPayload } from "jose";
import { getCookie, deleteCookie, setCookie } from "cookies-next/client";

export interface JwtPayload extends JWTPayload {
  sub: string;
  userId: string;
  workspaceId?: string;
  name: string;
  email: string;
  exp: number;
}

export function getJwt(userId: string) {
  const token = getRawJwt(userId);
  if (!token) {
    return undefined;
  }
  const payload = decodeJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < currentTime) {
    return undefined;
  }
  return payload as JwtPayload;
}

export function getRawJwt(userId: string) {
  return getCookie(`jwt-${userId}`);
}

export function clearJwt(userId: string) {
  deleteCookie(`jwt-${userId}`);
}

export function clearAllJwts() {
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const [key] = cookie.trim().split("=");
    if (key.startsWith("jwt-")) {
      deleteCookie(key);
    }
  });
}

export function setJwt(userId: string, token: string) {
  setCookie(`jwt-${userId}`, token, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export function getAllJwts(): { [userId: string]: JwtPayload | undefined } {
  const cookies = document.cookie.split(";");
  const jwts: { [userId: string]: JwtPayload | undefined } = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key.startsWith("jwt-")) {
      const userId = key.replace("jwt-", "");
      try {
        const payload = decodeJwt(value);
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          deleteCookie(key);
        } else {
          jwts[userId] = payload as JwtPayload;
        }
      } catch {
        deleteCookie(key);
      }
    }
  });

  return jwts;
}

export async function createJwt(payload: Omit<JwtPayload, "exp">) {
  const token = await new SignJWT(payload)
    .setExpirationTime("2h")
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return token;
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );
    return payload as JwtPayload;
  } catch {
    throw new Error("Invalid token");
  }
}

export function isValidJwt(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return !!(payload.exp && payload.exp > currentTime);
  } catch {
    return false;
  }
}

export async function refreshJwt(userId: string): Promise<string | undefined> {
  const currentJwt = getRawJwt(userId);
  if (!currentJwt) return undefined;

  try {
    const payload = await verifyJwt(currentJwt);
    // Create new token with refreshed expiration
    const newToken = await createJwt({
      sub: payload.sub,
      userId: payload.userId,
      workspaceId: payload.workspaceId,
      name: payload.name,
      email: payload.email,
    });

    setJwt(userId, newToken);
    return newToken;
  } catch {
    clearJwt(userId);
    return undefined;
  }
}
