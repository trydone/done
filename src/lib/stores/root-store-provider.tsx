"use client";
import type React from "react";

import { RootStoreContext, rootStore } from "./root-store";
import { PropsWithChildren } from "react";

export const RootStoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
};
