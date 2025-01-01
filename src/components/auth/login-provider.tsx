import { loginContext } from "@/hooks/use-login";
import { clearJwt } from "@/lib/jwt";
import { authRef } from "@/lib/zero-setup";
import { ReactNode, useCallback, useSyncExternalStore } from "react";

type Props = {
  children: ReactNode;
};

export const LoginProvider = ({ children }: Props) => {
  const loginState = useSyncExternalStore(
    authRef.onChange,
    useCallback(() => authRef.value, []),
  );

  return (
    <loginContext.Provider
      value={{
        logout: () => {
          clearJwt();
          authRef.value = undefined;
        },
        loginState,
      }}
    >
      {children}
    </loginContext.Provider>
  );
};
