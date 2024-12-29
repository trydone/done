import { createContext, useContext } from "react";
import { LoginState, User, Workspace } from "../zero-setup";

interface LoginContextValue {
  loginState: LoginState | undefined;
  login: (provider: string) => Promise<void>;
  logout: (userId?: string) => void;
  switchUser: (userId: string) => void;
  switchWorkspace: (workspaceId: string) => void;
  getActiveUser: () => User | undefined;
  getActiveWorkspace: () => Workspace | undefined;
}

export const loginContext = createContext<LoginContextValue | undefined>(
  undefined,
);

export function useLogin(): LoginContextValue {
  const context = useContext(loginContext);

  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }

  return context;
}
