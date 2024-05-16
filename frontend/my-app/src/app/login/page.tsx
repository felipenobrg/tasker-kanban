'use client'

import { useSession } from 'next-auth/react'
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
import PostResendCode from '@/lib/verifyCode/resendCode'
import { useContext } from 'react'
import { UserContext } from '@/context/userContext'
import TaskerLogo from '../../assets/taskerLogo.png'
import Image from 'next/image'

export default function Login() {
  const { data: session } = useSession()
  const router = useRouter()

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
          router.replace('/')
          toast.success('Login bem-sucedido!')
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
  // if (session) {
  //   router.replace('/')
  //   return null
  // }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col sm:flex-row">
        <Card className="flex items-center justify-center flex-col max-w-sm bg-black border-none rounded-l w-full">
          <CardHeader className="flex items-center justify-center">
            <Image
              src={TaskerLogo}
              alt="Logo do site Tasker"
              className="w-10 h-10 rounded"
            />
            <CardTitle className="text-lg mb-3">Acesse o Tasker</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="password">Senha</Label>
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
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="underline">
                Registre-se
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center bg-blue-900 w-full sm:w-[30rem] border-none rounded-r">
          <CardContent className="w-80">
            <h1 className="text-3xl text-start font-jakarta font-bold mb-2">
              Explore nossa <br /> Comunidade
            </h1>
            <Link
              href="https://github.com/felipenobrg/tasker"
              className="text-sm text-gray-100"
            >
              Descubra mais sobre o Tasker e junte-se à nossa comunidade.
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
