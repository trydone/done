"use client";
import { createContext } from "react";

import { LocalStore } from "./local-store";
import { AuthStore } from "./auth-store";

export class RootStore {
  private static instance: RootStore | null = null;

  localStore!: LocalStore;
  authStore!: AuthStore;

  public static getInstance(): RootStore {
    if (!RootStore.instance) {
      RootStore.instance = new RootStore();
    }
    return RootStore.instance;
  }

  private constructor() {
    if (RootStore.instance) {
      return RootStore.instance;
    }

    this.localStore = new LocalStore(this);
    this.authStore = new AuthStore(this);
  }
}
const rootStoreInstance = RootStore.getInstance();

export const rootStore = rootStoreInstance;
export const RootStoreContext = createContext<RootStore>(rootStoreInstance);
