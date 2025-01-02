import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { InputField } from "@/components/fields/input-field";
import { PasswordField } from "@/components/fields/password-field";
import { Button } from "@/components/ui/button";
import { useCello } from "@/lib/cello/use-cello";
import { getSupabaseClient } from "@/lib/supabase/supabase-client";
import { clientGetUrl } from "@/lib/utils/client-get-url";
import { RETURN_TO_KEY } from "@/lib/utils/constants";

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  email: z.string().email().min(1, { message: "Required" }),
  password: z.string().min(6, { message: "Too short" }),
  jobTitle: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

type Props = {
  isBusiness?: boolean;
  returnTo: string;
  forwardQuery?: string;
};

export const SignUpForm = ({ returnTo, isBusiness, forwardQuery }: Props) => {
  const { t } = useTranslation();
  const supabase = getSupabaseClient();
  const [loading, setLoading] = useState(false);
  const { getUcc } = useCello();

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      jobTitle: "",
    },
  });

  const submitHandler = useCallback(
    async (input: Schema) => {
      try {
        setLoading(true);
        setCookie(RETURN_TO_KEY, returnTo);

        const ucc = await getUcc();
        const { error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            emailRedirectTo: `${clientGetUrl()}/auth/callback`,
            data: {
              name: input.name,
              jobTitle: input.jobTitle,
              isBusiness,
              ucc,
            },
          },
        });

        if (error) {
          throw error;
        }

        setTimeout(() => {
          window.location.href =
            returnTo + (forwardQuery ? `?${forwardQuery}` : "");
        }, 500);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [forwardQuery, getUcc, isBusiness, returnTo, supabase.auth],
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <InputField
        control={control}
        name="name"
        label={t("full_name")}
        placeholder="E.g. John Smith"
      />

      <InputField
        control={control}
        type="email"
        name="email"
        label={t("email_address")}
        placeholder="E.g. you@email.com"
      />

      <PasswordField
        control={control}
        name="password"
        placeholder={t("6_characters")}
        label={t("password")}
      />

      <Button type="submit" loading={loading} className="w-full shadow-sm">
        {t("sign_up_submit")}
      </Button>
    </form>
  );
};
