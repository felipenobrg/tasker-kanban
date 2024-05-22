import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CheckEmail from '@/lib/auth/forgotPassword/checkEmail';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BASE_FRONT_URL } from '../../../../apiConfig';
import { useState } from 'react';

interface DialogCheckEmailProps {
  isOpen: boolean
  onClose: () => void
}
const DialogCheckEmail = ({
  isOpen,
  onClose,
}: DialogCheckEmailProps) => {
  const { theme } = useTheme()
  const [disabled, setDisabled] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [countDown, setCountDown] = useState(10)

  const schema = z.object({
    email: z
      .string()
      .email({ message: 'Por favor, insira um endereço de email válido' }),
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

  const onSubmit = async (data: any) => {
    try {
      const response = await CheckEmail({ email: data.email, url: BASE_FRONT_URL + '/resetPassword' })
      if (!response) return

      setDisabled(true)
      setSuccessMsg('Email enviado com sucesso')
      const interval = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0) {
            setDisabled(false)
            setSuccessMsg('')
            clearInterval(interval)
            return 10
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      setError('email', {
        type: 'manual',
        message: 'Email não encontrado',
      })
      console.error('Error sending email:', error)
      throw error
    }
  }

  return (
    <Dialog.Root modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-90 z-50" />
      <Dialog.Content
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md p-6 w-[30rem] flex flex-col gap-2 justify-center items-center z-50 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'
          }`}
      >
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">Email</h1>
          </div>
          <p className='text-sm'>Verifique seu email</p>
          <Input
            type="email"
            className="w-[20rem]"
            placeholder="Digite seu email"
            {...register('email')}
          />
          {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          <Button type="submit" className="mt-3" disabled={(isSubmitting || disabled)}>
            {isSubmitting ? 'Enviando...' : disabled ? `Reenviar em ${countDown}s` : 'Enviar' }
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default DialogCheckEmail;