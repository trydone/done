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

  const zero = new Zero({
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
  zeroAtom.value = zero;

  exposeDevHooks(zero);
});

let didPreload = false;

export const preload = (zero: Zero<Schema>) => {
  if (didPreload) {
    return;
  }

  didPreload = true;

  const baseTaskQuery = zero.query.task
    .related("tags")
    .related("view_state", (q) => q.where("user_id", zero.userID).one());

  const { cleanup, complete } = baseTaskQuery.preload();
  complete.then(() => {
    cleanup();
    baseTaskQuery
      .related("creator")
      .related("assignee")
      .related("emoji", (emoji) =>
        emoji.related("creator", (creator) => creator.one()),
      )
      .related("comments", (comments) =>
        comments
          .related("creator", (creator) => creator.one())
          .related("emoji", (emoji) =>
            emoji.related("creator", (creator) => creator.one()),
          )
          .limit(INITIAL_COMMENT_LIMIT)
          .orderBy("created_at", "desc"),
      )
      .preload();
  });

  zero.query.user.preload();
  zero.query.tag.preload();
};

// To enable accessing zero in the devtools easily.
function exposeDevHooks(zero: Zero<Schema>) {
  const casted = window as unknown as {
    z?: Zero<Schema>;
  };
  casted.z = zero;
}

export { authAtom as authRef, zeroAtom as zeroRef };
