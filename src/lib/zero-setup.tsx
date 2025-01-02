import { Zero } from "@rocicorp/zero";
import { clearJwt, getJwt, getRawJwt } from "./jwt";
import { Schema, schema } from "@/schema";
import { Atom } from "./atom";

// One more than we display so we can detect if there are more
// to load.
export const INITIAL_COMMENT_LIMIT = 101;

export type LoginState = {
  encoded: string;
  decoded: {
    sub: string;
    name: string;
    role: "admin" | "user";
  };
};

const zeroAtom = new Atom<Zero<Schema>>();
const authAtom = new Atom<LoginState>();
const jwt = getJwt();
const encodedJwt = getRawJwt();

authAtom.value =
  encodedJwt && jwt
    ? {
        encoded: encodedJwt,
        decoded: jwt as LoginState["decoded"],
      }
    : undefined;

authAtom.onChange((auth) => {
  zeroAtom.value?.close();

  if (typeof window === "undefined") {
    return;
  }

  const z = new Zero({
    logLevel: "info",
    server: process.env.NEXT_PUBLIC_SERVER,
    userID: auth?.decoded?.sub ?? "anon",
    auth: (error?: "invalid-token") => {
      if (error === "invalid-token") {
        clearJwt();
        authAtom.value = undefined;
        return undefined;
      }
      return auth?.encoded;
    },
    schema,
    kvStore: "mem",
  });
  zeroAtom.value = z;

  exposeDevHooks(z);
});

let didPreload = false;

export function preload(z: Zero<Schema>) {
  if (didPreload) {
    return;
  }

  didPreload = true;

  const baseTaskQuery = z.query.task
    .related("tags")
    .related("view_state", (q) => q.where("user_id", z.userID).one());

  const { cleanup, complete } = baseTaskQuery.preload();
  complete.then(() => {
    cleanup();
    baseTaskQuery
      .related("creator")
      .related("assignee")
      .related("emoji", (emoji) =>
        emoji.related("creator", (creator) => creator.one())
      )
      .related("comments", (comments) =>
        comments
          .related("creator", (creator) => creator.one())
          .related("emoji", (emoji) =>
            emoji.related("creator", (creator) => creator.one())
          )
          .limit(INITIAL_COMMENT_LIMIT)
          .orderBy("created_at", "desc")
      )
      .preload();
  });

  z.query.user.preload();
  z.query.tag.preload();
}

// To enable accessing zero in the devtools easily.
function exposeDevHooks(z: Zero<Schema>) {
  const casted = window as unknown as {
    z?: Zero<Schema>;
  };
  casted.z = z;
}

export { authAtom as authRef, zeroAtom as zeroRef };
