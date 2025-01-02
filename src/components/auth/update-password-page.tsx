"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { AuthMFA } from "@/components/auth/auth-mfa";
import { PasswordField } from "@/components/fields/password-field";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase/supabase-client";

const schema = z.object({
  password: z.string().min(1, { message: "Required" }),
});

type Schema = z.infer<typeof schema>;

const redirectTo = "/sites";

export const UpdatePasswordForm = () => {
  const { t } = useTranslation();
  const supabase = getSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [showMFAScreen, setShowMFAScreen] = useState(false);

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      password: "",
    },
  });

  const submitHandler = useCallback(
    async ({ password }: Schema) => {
      try {
        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
          throw error;
        }

        // Check if MFA is required
        const { data, error: mfaError } =
          await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (mfaError) {
          throw mfaError;
        }

        if (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) {
          setShowMFAScreen(true);
          return;
        }

        setTimeout(() => {
          window.location.href = redirectTo;
        }, 500);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [supabase.auth],
  );

  if (showMFAScreen) {
    return <AuthMFA redirectTo={redirectTo} label={t("update_password")} />;
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <PasswordField
        control={control}
        name="password"
        label={t("new_password")}
        placeholder={t("6_characters")}
      />

      <Button type="submit" loading={loading} className="w-full shadow-sm">
        {t("update_password")}
      </Button>
    </form>
  );
};
