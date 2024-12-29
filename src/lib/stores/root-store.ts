"use client";
import { createContext } from "react";

import { LocalStore } from "./local-store";

export class RootStore {
	private static instance: RootStore | null = null;

	localStore!: LocalStore;

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
	}
}
const rootStoreInstance = RootStore.getInstance();

export const rootStore = rootStoreInstance;
export const RootStoreContext = createContext<RootStore>(rootStoreInstance);
