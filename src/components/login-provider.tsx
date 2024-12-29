import { loginContext } from "@/lib/hooks/use-login";
import { createJwt, JwtPayload } from "@/lib/jwt";
import {
  authRef,
  loginUser,
  logoutAllUsers,
  logoutUser,
  setActiveUser,
  setActiveWorkspace,
} from "@/lib/zero-setup";
import { useCallback, useSyncExternalStore } from "react";

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const loginState = useSyncExternalStore(
    authRef.onChange,
    useCallback(() => authRef.value, []),
  );

  const login = useCallback(async (provider: string) => {
    try {
      const response = await fetch(`/api/auth/${provider}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Login failed");
      }

      const payload: Omit<JwtPayload, "exp"> = {
        sub: data.user.id,
        userId: data.user.id,
        workspaceId: data.workspace?.id,
        name: data.user.name,
        email: data.user.email,
      };

      const token = await createJwt(payload);
      loginUser(data.user.id, token, {
        ...payload,
        exp: Date.now() + 2 * 60 * 60 * 1000,
      } as JwtPayload);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback((userId?: string) => {
    if (userId) {
      logoutUser(userId);
    } else {
      logoutAllUsers();
    }
  }, []);

  const switchUser = useCallback(
    (userId: string) => {
      if (!loginState) return;
      setActiveUser(userId);
    },
    [loginState],
  );

  const switchWorkspace = useCallback(
    (workspaceId: string) => {
      if (!loginState) return;
      setActiveWorkspace(workspaceId);
    },
    [loginState],
  );

  const getActiveUser = useCallback(() => {
    if (!loginState?.activeUser) return undefined;

    const userAuth = loginState.users[loginState.activeUser];
    if (!userAuth) return undefined;

    return {
      id: userAuth.decoded.userId,
      name: userAuth.decoded.name,
      email: userAuth.decoded.email,
      workspaces: [], // Fetch from Zero/backend as needed
    };
  }, [loginState]);

  const getActiveWorkspace = useCallback(() => {
    if (!loginState?.activeWorkspace || !loginState.activeUser)
      return undefined;

    const userAuth = loginState.users[loginState.activeUser];
    if (!userAuth) return undefined;

    return {
      id: loginState.activeWorkspace,
      name: "",
      ownerId: "",
      members: [],
    };
  }, [loginState]);

  return (
    <loginContext.Provider
      value={{
        loginState,
        login,
        logout,
        switchUser,
        switchWorkspace,
        getActiveUser,
        getActiveWorkspace,
      }}
    >
      {children}
    </loginContext.Provider>
  );
}
