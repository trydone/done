import { zodResolver } from "@hookform/resolvers/zod";
import postHog from "posthog-js";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { InputField } from "@/components/fields/input-field";
import { PasswordField } from "@/components/fields/password-field";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase/supabase-client";

import { AuthMFA } from "./auth-mfa";

const schema = z.object({
  email: z.string().email().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
});

type Schema = z.infer<typeof schema>;

type Props = {
  redirectTo: string;
  showMFA: boolean;
  setShowMFA: (show: boolean) => void;
};

export const SignInForm = ({ redirectTo, showMFA, setShowMFA }: Props) => {
  const supabase = getSupabaseClient();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = useCallback(
    async ({ email, password }: Schema) => {
      try {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (email) {
          postHog.setPersonPropertiesForFlags({ email });
        }

        // Check if MFA is required
        const { data, error: mfaError } =
          await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (mfaError) {
          throw mfaError;
        }

        if (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) {
          setShowMFA(true);
          return;
        }

        setTimeout(() => {
          window.location.href = redirectTo;
        }, 500);
      } catch (error: any) {
        toast.error(error.message);
        setLoading(false);
      }
    },
    [redirectTo, setShowMFA, supabase.auth],
  );

  if (showMFA) {
    return <AuthMFA redirectTo={redirectTo} label={t("sign_in_submit")} />;
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <InputField
        control={control}
        type="email"
        name="email"
        label={null}
        placeholder={t("email_address")}
      />

      <PasswordField
        control={control}
        name="password"
        label={null}
        placeholder={t("password")}
      />

      <Button type="submit" loading={loading} className="w-full shadow-sm">
        {t("sign_in_submit")}
      </Button>
    </form>
  );
};
