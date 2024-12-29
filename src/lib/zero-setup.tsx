import { Zero } from "@rocicorp/zero";
import { Atom } from "./atom";
import {
  clearJwt,
  getRawJwt,
  getAllJwts,
  JwtPayload,
  clearAllJwts,
} from "./jwt";
import { schema, Schema } from "@/schema";

// One more than we display so we can detect if there are more
// to load.
export const INITIAL_COMMENT_LIMIT = 101;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  workspaces: Workspace[];
}

export interface Workspace {
  id: string;
  name: string;
  avatar?: string;
  ownerId: string;
  members: string[];
}

export interface LoginState {
  users: {
    [userId: string]: {
      encoded: string;
      decoded: JwtPayload;
      zero: Zero<Schema>;
    };
  };
  activeUser?: string;
  activeWorkspace?: string;
}

const zeroAtom = new Atom<{ [userId: string]: Zero<Schema> }>();
const authAtom = new Atom<LoginState>();

// Initialize from stored JWTs
const jwts = getAllJwts();
const initialUsers: LoginState["users"] = {};
const initialZeros: { [userId: string]: Zero<Schema> } = {};

Object.entries(jwts).forEach(([userId, jwt]) => {
  const encodedJwt = getRawJwt(userId);
  if (encodedJwt && jwt) {
    const zero = createZeroInstance(userId, encodedJwt, jwt);
    initialUsers[userId] = {
      encoded: encodedJwt,
      decoded: jwt,
      zero,
    };
    initialZeros[userId] = zero;
  }
});

if (Object.keys(initialUsers).length > 0) {
  authAtom.value = {
    users: initialUsers,
    activeUser: Object.keys(initialUsers)[0],
  };
  zeroAtom.value = initialZeros;
}

authAtom.onChange((auth) => {
  if (!auth) return;

  const currentZeros = zeroAtom.value || {};

  // Close zeros that are no longer needed
  Object.entries(currentZeros).forEach(([userId, zero]) => {
    if (!auth.users[userId]) {
      zero.close();
    }
  });

  // Create or keep zeros as needed
  const newZeros: { [userId: string]: Zero<Schema> } = {};
  Object.entries(auth.users).forEach(([userId, userAuth]) => {
    newZeros[userId] =
      currentZeros[userId] ||
      createZeroInstance(userId, userAuth.encoded, userAuth.decoded);
  });

  zeroAtom.value = newZeros;
});

function createZeroInstance(
  userId: string,
  encoded: string,
  decoded: JwtPayload,
): Zero<Schema> {
  const z = new Zero({
    logLevel: "info",
    server: process.env.NEXT_PUBLIC_SERVER,
    userID: userId,
    auth: (error?: "invalid-token") => {
      if (error === "invalid-token") {
        clearJwt(userId);
        const newAuthState = { ...authAtom.value };
        if (newAuthState) {
          delete newAuthState.users[userId];
          if (newAuthState.activeUser === userId) {
            newAuthState.activeUser = undefined;
            newAuthState.activeWorkspace = undefined;
          }
          authAtom.value = newAuthState;
        }
        return undefined;
      }
      return encoded;
    },
    schema,
  });

  exposeDevHooks(z);
  return z;
}

export function loginUser(
  userId: string,
  encoded: string,
  decoded: JwtPayload,
) {
  const zero = createZeroInstance(userId, encoded, decoded);

  authAtom.value = {
    users: {
      ...(authAtom.value?.users || {}),
      [userId]: { encoded, decoded, zero },
    },
    activeUser: userId,
  };
}

export function logoutUser(userId: string) {
  const currentZeros = zeroAtom.value;
  if (currentZeros?.[userId]) {
    currentZeros[userId].close();
  }

  clearJwt(userId);

  const currentAuth = authAtom.value;
  if (currentAuth) {
    const { [userId]: _, ...remainingUsers } = currentAuth.users;
    authAtom.value = {
      users: remainingUsers,
      activeUser:
        currentAuth.activeUser === userId ? undefined : currentAuth.activeUser,
      activeWorkspace:
        currentAuth.activeUser === userId
          ? undefined
          : currentAuth.activeWorkspace,
    };
  }
}

export function logoutAllUsers() {
  const currentZeros = zeroAtom.value;
  if (currentZeros) {
    Object.values(currentZeros).forEach((zero) => zero.close());
  }
  clearAllJwts();
  authAtom.value = { users: {} };
  zeroAtom.value = {};
}

export function setActiveUser(userId: string) {
  const currentAuth = authAtom.value;
  if (currentAuth?.users[userId]) {
    authAtom.value = {
      ...currentAuth,
      activeUser: userId,
      activeWorkspace: undefined,
    };
  }
}

export function setActiveWorkspace(workspaceId: string) {
  const currentAuth = authAtom.value;
  if (currentAuth) {
    authAtom.value = {
      ...currentAuth,
      activeWorkspace: workspaceId,
    };
  }
}

function exposeDevHooks(z: Zero<Schema>) {
  const casted = window as unknown as {
    z?: Zero<Schema>;
  };
  casted.z = z;
}

export { authAtom as authRef, zeroAtom as zeroRef };
