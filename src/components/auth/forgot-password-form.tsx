"use client";
import { CheckIcon } from "@fingertip/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { InputField } from "@/components/fields/input-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase/supabase-client";
import { clientGetUrl } from "@/lib/utils/client-get-url";
import { RETURN_TO_KEY } from "@/lib/utils/constants";

const schema = z.object({
  email: z.string().email().min(1, { message: "Required" }),
});

type Schema = z.infer<typeof schema>;

export const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
    },
  });

  const submitHandler = useCallback(
    async ({ email }: Schema) => {
      try {
        setLoading(true);
        setCookie(RETURN_TO_KEY, "/update-password");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${clientGetUrl()}/auth/callback`,
        });

        if (error) {
          throw error;
        }

        setMessage(t("check_your_inbox_for_a_password_reset_email"));
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [supabase.auth, t],
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {message && (
        <div className="mb-4">
          <Alert variant="success">
            <CheckIcon className="size-4" />
            <AlertTitle>{t("success")}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </div>
      )}

      <InputField
        control={control}
        type="email"
        name="email"
        label={t("email_address")}
        placeholder="E.g. you@email.com"
      />

      <Button type="submit" loading={loading} className="w-full shadow-sm">
        {t("send_reset_email")}
      </Button>
    </form>
  );
};
