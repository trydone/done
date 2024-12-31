import { deleteCookie, getCookie } from "cookies-next/client";
import { decodeJwt } from "jose";

export function getJwt() {
  const token = getRawJwt();
  if (!token) {
    return undefined;
  }
  const payload = decodeJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < currentTime) {
    return undefined;
  }

  return payload;
}

export function getRawJwt() {
  return getCookie("jwt");
}

export function clearJwt() {
  deleteCookie("jwt");
}
