import { schema } from "@/schema";
import { Zero } from "@rocicorp/zero";
import { getCookie } from "cookies-next";
import { decodeJwt } from "jose";

export function createZero() {
  const encodedJWT = getCookie('jwt')
  const decodedJWT = encodedJWT && decodeJwt(encodedJWT as string)
  const userID = decodedJWT?.sub ? (decodedJWT.sub as string) : 'anon'

  const zero = new Zero({
    userID,
    auth: (error?: 'invalid-token') => {
      if (error === 'invalid-token') {
        return undefined
      }
      return encodedJWT as string | undefined
    },
    server: process.env.NEXT_PUBLIC_SERVER,
    schema,
    kvStore: 'mem',
  })

  // Only expose in development
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    try {
      Object.defineProperty(window, 'z', {
        value: zero,
        writable: true,
        configurable: true,
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to expose Zero instance to window', e)
    }
  }

  return zero
}
