'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import Link from 'next/link'
import { UserContext } from '@/context/userContext'
import { useContext, useMemo, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import PostCode from '@/lib/auth/verifyCode/veriyCode'
import { useRouter } from 'next/navigation'
import PostResendCode from '@/lib/auth/verifyCode/resendCode'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

const FormSchema = z.object({
  pin: z
    .string()
    .min(4, {
      message: 'O código de verificação precisa ter 4 dígitos.',
    })
    .max(4),
})

export default function VerifyCode() {
  const { email } = useContext(UserContext)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userEmail = useMemo(() => {
    return email
  }, [email])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  })

  const router = useRouter()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true)
      await PostCode({
        email: userEmail,
        code: data.pin,
      })
      router.push('/')
    } catch (error: any) {
      console.error('Error posting verification code :', error)
      if ((error as AxiosError)?.response?.status === 400) {
        toast.error(
          'O email já foi usado. Por favor, verifique o email e tente novamente.',
        )
      } else {
        toast.error('Ocorreu um erro. Por favor, tente novamente mais tarde.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendCode = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault()

    try {
      await PostResendCode({
        email: email,
      })
    } catch (error) {
      console.error('Error resending verification code:', error)
      throw error
    }
  }

  if (!userEmail) {
    router.push('/login')
  }

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <Card className="max-w-sm h-fit">
        <CardHeader>
          <CardTitle className="text-2xl">Verifique seu código</CardTitle>
          <CardDescription>
            Um código de verificação foi enviado para o seu email. Insira o
            código abaixo para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot className="text-3xl" index={0} />
                          <InputOTPSlot className="text-3xl" index={1} />
                          <InputOTPSlot className="text-3xl" index={2} />
                          <InputOTPSlot className="text-3xl" index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link href={`/`} className="underline" onClick={resendCode}>
              Reenviar código
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
