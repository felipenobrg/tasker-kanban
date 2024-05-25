'use client'

import { Button } from '@/components/ui/button'
import { AxiosError } from '@/types/axiosError'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { useTheme } from 'next-themes'
import { useRouter, useSearchParams } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import resetPassword from '@/lib/auth/forgotPassword/resetPassword'
import { useMemo } from 'react'
import Link from 'next/link'

const ResetPassword = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()

  const schema = z.object({
    password: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
  })

  type FormFields = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'As senhas devem ser iguais',
      })
      return
    }
    try {
      const token = searchParams.get('token')
      await resetPassword({ password: data.password, token: token })

      router.push('/')
    } catch (error: AxiosError | any) {
      const msg = error.response?.data?.message
      if (msg === 'new password cannot be the same as the old password') {
        setError('password', {
          type: 'manual',
          message: 'A nova senha não pode ser igual à antiga',
        })
      } else {
        console.error('Error:', error)
      }
    }
  }

  const expTime = useMemo(() => {
    const exp = searchParams.get('expires')
    if (exp) {
      return new Date(parseInt(exp) * 1000)
    }
    return null
  }, [searchParams])

  if (!expTime || expTime < new Date()) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="flex items-center justify-center flex-col max-w-sm bg-black border-none rounded-xl w-full h-full p-6">
          <h1 className="text-lg font-bold text-white">Link expirado</h1>
          <Link
            href="/login"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Ir para Login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col sm:flex-row">
        <Card className="flex items-center justify-center flex-col max-w-sm bg-black border-none rounded-xl w-full h-full p-6">
          <CardHeader className="text-start w-full">
            <CardTitle
              className={`text-lg font-bold ${theme === 'dark' ? 'text-lg' : 'text-white'}`}
            >
              Redefina sua senha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Informe sua senha"
                    required
                    className="text-sm w-[17rem]"
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirme a senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="Informe sua senha"
                    required
                    className="text-sm w-[17rem]"
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Redefinir senha'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default ResetPassword
