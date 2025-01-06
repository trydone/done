import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { InputField } from '@/components/fields/input-field'
import { PasswordField } from '@/components/fields/password-field'
import { Button } from '@/components/ui/button'

const schema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  email: z.string().email().min(1, { message: 'Required' }),
  password: z.string().min(6, { message: 'Too short' }),
  jobTitle: z.string().optional(),
})

type Schema = z.infer<typeof schema>

type Props = {
  returnTo: string
  forwardQuery?: string
}

export const SignUpForm = ({ returnTo, forwardQuery }: Props) => {
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      jobTitle: '',
    },
  })

  const submitHandler = useCallback(
    async (_input: Schema) => {
      try {
        setLoading(true)
        // setCookie(RETURN_TO_KEY, returnTo);

        // const { error } = await supabase.auth.signUp({
        //   email: input.email,
        //   password: input.password,
        //   options: {
        //     emailRedirectTo: `https://trydone.io/auth/callback`,
        //     data: {
        //       name: input.name,
        //     },
        //   },
        // });

        // if (error) {
        //   throw error;
        // }

        setTimeout(() => {
          window.location.href =
            returnTo + (forwardQuery ? `?${forwardQuery}` : '')
        }, 500)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    },
    [forwardQuery, returnTo],
  )

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <InputField
        control={control}
        name="name"
        label="Full name"
        placeholder="E.g. John Smith"
      />

      <InputField
        control={control}
        type="email"
        name="email"
        label="Email address"
        placeholder="E.g. you@email.com"
      />

      <PasswordField
        control={control}
        name="password"
        placeholder="6+ characters"
        label="Password"
      />

      <Button type="submit" loading={loading} className="w-full shadow-sm">
        Sign up
      </Button>
    </form>
  )
}
