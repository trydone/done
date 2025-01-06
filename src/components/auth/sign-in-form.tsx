import {zodResolver} from '@hookform/resolvers/zod'
import {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'sonner'
import * as z from 'zod'

import {InputField} from '@/components/fields/input-field'
import {PasswordField} from '@/components/fields/password-field'
import {Button} from '@/components/ui/button'

const schema = z.object({
  email: z.string().email().min(1, {message: 'Required'}),
  password: z.string().min(1, {message: 'Required'}),
})

type Schema = z.infer<typeof schema>

type Props = {
  redirectTo: string
}

export const SignInForm = ({redirectTo}: Props) => {
  const [loading, setLoading] = useState(false)

  const {control, handleSubmit} = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const submitHandler = useCallback(
    async ({}: Schema) => {
      try {
        setLoading(true)

        // const { error } = await supabase.auth.signInWithPassword({
        //   email,
        //   password,
        // });

        // if (error) {
        //   throw error;
        // }

        setTimeout(() => {
          window.location.href = redirectTo
        }, 500)
      } catch (error: any) {
        toast.error(error.message)
        setLoading(false)
      }
    },
    [redirectTo],
  )

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <InputField
        control={control}
        type="email"
        name="email"
        label={null}
        placeholder="Email address"
      />

      <PasswordField
        control={control}
        name="password"
        label={null}
        placeholder="Password"
      />

      <Button type="submit" loading={loading} className="w-full shadow-sm">
        Sign in
      </Button>
    </form>
  )
}
