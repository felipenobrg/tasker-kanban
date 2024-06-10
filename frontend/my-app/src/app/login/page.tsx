'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LoginAuth from '@/lib/auth/login'
import { toast } from 'react-toastify'
import { AxiosError } from '@/types/axiosError'
import PostResendCode from '@/lib/auth/verifyCode/resendCode'
import { useCallback, useContext, useState } from 'react'
import { UserContext } from '@/context/userContext'
import TaskerLogo from '../../assets/taskerLogo.png'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import DialogCheckEmail from '@/components/dialogs/dialogCheckEmail'
import CardAboutRepo from '@/components/cardAboutRepo/cardAboutRepo'
import 'react-toastify/dist/ReactToastify.css'

export default function Login() {
  const router = useRouter()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const schema = z.object({
    email: z
      .string()
      .email({ message: 'Por favor, insira um endereço de email válido' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  })

  type FormFields = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  const { setEmail } = useContext(UserContext)

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await LoginAuth({
        email: data.email,
        password: data.password,
      })

      if (response) {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          callbackUrl: '/',
          redirect: true,
        })
        if (result?.error) {
          setError('email', { message: 'Email ou senha incorretos' })
          setError('password', { message: 'Email ou senha incorretos' })
          console.error('Authentication Error:', result.error)
        } else {
          router.push('/')
          toast.success('Login bem-sucedido!')
          reset()
        }
      }
    } catch (error: AxiosError | any) {
      if (error.response?.data?.message === 'user not verified') {
        try {
          await PostResendCode({
            email: data.email,
          })
          setEmail(data.email)
          router.replace('/verifyCode')
        } catch (error) {
          console.error('Error resending verification code:', error)
        }
      } else {
        console.error('Error:', error)
        setError('password', { message: 'Email ou senha incorretos' })
      }
    }
  }

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col-reverse w-screen sm:w-fit sm:flex-row">
        <Card className="flex items-center justify-center flex-col max-w-sm bg-black border-none w-full rounded-r-none rounded-none sm:rounded-l-xl sm:w-[25rem] sm:h-[40rem]">
          <CardHeader className="flex items-center justify-center">
            <Image
              src={TaskerLogo}
              alt="Logo do site Tasker"
              className="w-10 h-10 rounded"
            />
            <CardTitle
              className={`text-lg ${theme === 'dark' ? 'text-base' : 'text-white'}`}
            >
              Acesse o Tasker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className={`${theme === 'dark' ? 'text-base' : 'text-white'}`}
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Informe seu email"
                    className="w-[17rem]"
                    required
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label
                      htmlFor="password"
                      className={`${theme === 'dark' ? 'text-base' : 'text-white'}`}
                    >
                      Senha
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Informe sua senha"
                    className="w-[17rem]"
                    required
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password.message}
                    </span>
                  )}
                  <div
                    className={`text-end text-sm hover:text-gray-200 ${theme === 'dark' ? 'text-base' : 'text-gray-50'}`}
                  >
                    <span
                      className="cursor-pointer underline"
                      onClick={() => setIsOpen(true)}
                    >
                      Esqueci minha senha
                    </span>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Entrando...' : 'Login'}
                </Button>
              </div>
            </form>
            <div
              className={`mt-4 text-center text-sm hover:text-gray-200 ${theme === 'dark' ? 'text-base' : 'text-gray-50'}`}
            >
              Não tem uma conta?{' '}
              <Link href="/register" className="underline">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
        <CardAboutRepo
          title="Explore nossa Comunidade"
          description="Descubra mais sobre o Tasker e junte-se à nossa comunidade."
        />
        {isOpen && <DialogCheckEmail isOpen={isOpen} onClose={onClose} />}
      </div>
    </main>
  )
}
