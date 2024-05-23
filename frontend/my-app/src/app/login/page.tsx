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
import 'react-toastify/dist/ReactToastify.css'
import LoginAuth from '@/lib/auth/login'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AxiosError } from '@/types/axiosError'
import PostResendCode from '@/lib/auth/verifyCode/resendCode'
import { useCallback, useContext, useState } from 'react'
import { UserContext } from '@/context/userContext'
import TaskerLogo from '../../assets/taskerLogo.png'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import DialogCheckEmail from '@/components/dialogs/dialogCheckEmail'

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
          redirect: false,
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
      <div className="flex flex-col-reverse sm:flex-row">
        <Card className="flex items-center justify-center flex-col max-w-sm bg-black border-none w-full rounded-r-none rounded-l-xl">
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
                    <span className="text-red-500">{errors.email.message}</span>
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
                    placeholder="Informa sua senha"
                    className="w-[17rem]"
                    required
                  />
                  {errors.password && (
                    <span className="text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                  <div
                    className={`text-end text-sm hover:text-gray-200 ${theme === 'dark' ? 'text-bae' : 'text-gray-50'}`}
                  >
                    <span
                      className="underline cursor-pointer"
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
              className={` mt-4 text-center text-sm hover:text-gray-200 ${theme === 'dark' ? 'text-bae' : 'text-gray-50'}`}
            >
              Não tem uma conta?{' '}
              <Link href="/register" className="underline">
                Registre-se
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center bg-blue-900 w-full h-52 sm:w-[25rem] sm:h-[35rem] border-none rounded-xl sm:rounded-l-none sm:rounded-r-xl">
          {' '}
          <CardContent className="w-80">
            <h1
              className={`text-3xl text-start font-jakarta font-bold mb-2 ${theme === 'dark' ? 'text-base' : 'text-white'}`}
            >
              Explore nossa <br /> Comunidade
            </h1>
            <Link
              href="https://github.com/felipenobrg/tasker"
              className={`text-sm text-gray-100 hover:text-gray-200text-3xl text-start font-jakarta font-normal mb-2 ${theme === 'dark' ? 'text-base' : 'text-white'}`}
            >
              Descubra mais sobre o Tasker e junte-se à nossa comunidade.
            </Link>
          </CardContent>
        </Card>
        {isOpen && <DialogCheckEmail isOpen={isOpen} onClose={onClose} />}
      </div>
    </main>
  )
}
