'use client'
import {zodResolver} from '@hookform/resolvers/zod'
import {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'sonner'
import * as z from 'zod'

import {PasswordField} from '@/components/fields/password-field'
import {Button} from '@/components/ui/button'

const schema = z.object({
  password: z.string().min(1, {message: 'Required'}),
})

type Schema = z.infer<typeof schema>

const redirectTo = '/sites'

export const UpdatePasswordForm = () => {
  const [loading, setLoading] = useState(false)

  const {control, handleSubmit} = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      password: '',
    },
  })

  const submitHandler = useCallback(async ({}: Schema) => {
    try {
      setLoading(true)

      // const { error } = await supabase.auth.updateUser({ password });

      // if (error) {
      //   throw error;
      // }

      setTimeout(() => {
        window.location.href = redirectTo
      }, 500)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <PasswordField
        control={control}
        name="password"
        label="New password"
        placeholder="6+ characters"
      />

      <Button type="submit" loading={loading} className="w-full shadow-sm">
        Update password
      </Button>
    </form>
  )
}
