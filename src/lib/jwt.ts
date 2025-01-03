import { deleteCookie, getCookie } from "cookies-next/client";
import { decodeJwt } from "jose";

export const getJwt = () => {
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
};

export const getRawJwt = () => {
  return getCookie("jwt");
};

export const clearJwt = () => {
  deleteCookie("jwt");
};
