'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import SigninAuth from '@/lib/auth/signin'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/context/userContext'
import { useContext } from 'react'
import { useTheme } from 'next-themes'
import GithubButton from '@/components/ui/githubButton'
import CardAboutRepo from '@/components/cardAboutRepo/cardAboutRepo'
import Spinner from '@/assets/spinner'

export default function Register() {
  const { setEmail } = useContext(UserContext)
  const { theme } = useTheme()

  const schema = z.object({
    name: z
      .string()
      .min(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
      .max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
    email: z
      .string()
      .email({ message: 'Por favor, informe um endereço de e-mail válido' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
  })

  type FormFields = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await SigninAuth({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      setEmail(data.email)
      router.replace('/verifyCode')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col-reverse w-screen sm:w-fit sm:flex-row">
        <Card className="flex items-center justify-center flex-col max-w-sm bg-black border-none w-full rounded-r-none rounded-none sm:rounded-l-xl sm:w-[25rem] sm:h-[40rem]">
          <CardHeader>
            <CardTitle
              className={`text-lg font-bold ${theme === 'dark' ? 'text-base' : 'text-white'}`}
            >
              Cadastre-se
            </CardTitle>
            <CardDescription
              className={`text-gray-50 ${theme === 'dark' ? 'text-base' : 'text-white'}`}
            >
              Informe suas informações para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    {...register('name')}
                    className="w-[17rem]"
                    placeholder="Informe seu nome"
                    required
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="text-sm w-[17rem]"
                    placeholder="Informe seu email"
                    required
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Informe sua senha"
                    required
                    className="text-sm w-[17rem]"
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <Spinner size="sm" /> Enviando...
                    </div>
                  ) : (
                    'Criar conta'
                  )}{' '}
                </Button>
              </div>
            </form>
            <div
              className={`mt-4 text-center text-sm hover:text-gray-200 ${theme === 'dark' ? 'text-base' : 'text-gray-50'}`}
            >
              Já tem uma conta?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
        <CardAboutRepo
          title="Entre na nossa Comunidade"
          description=" Explore nosso repositório e seja parte do progresso!"
        />
      </div>
    </main>
  )
}
