import axios from 'axios'
import { BASE_URL } from '../../../apiConfig'

interface PostCode {
  email: string
  code: string
}

export default async function PostCode(props: PostCode) {
  const { email, code } = props
  try {
    const response = await axios.post(
      `${BASE_URL}/verifycode`,
      {
        email,
        code,
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
