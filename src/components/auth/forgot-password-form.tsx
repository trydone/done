'use client'
import {zodResolver} from '@hookform/resolvers/zod'
import {CheckIcon} from 'lucide-react'
import {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'sonner'
import * as z from 'zod'

import {InputField} from '@/components/fields/input-field'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'

const schema = z.object({
  email: z.string().email().min(1, {message: 'Required'}),
})

type Schema = z.infer<typeof schema>

export const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {control, handleSubmit} = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      email: '',
    },
  })

  const submitHandler = useCallback(async ({}: Schema) => {
    try {
      setLoading(true)
      // setCookie(RETURN_TO_KEY, "/update-password");

      // const { error } = await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: `${clientGetUrl()}/auth/callback`,
      // });

      // if (error) {
      //   throw error;
      // }

      setMessage('Check your inbox for a password reset email.')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {message && (
        <div className="mb-4">
          <Alert variant="success">
            <CheckIcon className="size-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </div>
      )}

      <InputField
        control={control}
        type="email"
        name="email"
        label="Email address"
        placeholder="E.g. you@email.com"
      />

      <Button type="submit" loading={loading} className="w-full shadow-sm">
        Send reset email
      </Button>
    </form>
  )
}
