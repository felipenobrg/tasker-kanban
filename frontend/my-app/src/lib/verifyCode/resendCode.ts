import axios from 'axios'
import { BASE_URL } from '../../../apiConfig'

interface PostResendCode {
  email: string
}

export default async function PostResendCode(props: PostResendCode) {
  const { email } = props
  try {
    const response = await axios.post(
      `${BASE_URL}/resendcode`,
      {
        email,
      },
      { withCredentials: true },
    )
    console.log('response', response.data)
    return response.data
  } catch (error) {
    console.error('Error posting verification code:', error)
    throw error
  }
}
