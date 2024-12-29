"use client";
import type React from "react";

import { RootStoreContext, rootStore } from "./root-store";

export const RootStoreProvider = ({ children }: React.PropsWithChildren) => {
	return (
		<RootStoreContext.Provider value={rootStore}>
			{children}
		</RootStoreContext.Provider>
	);
};
