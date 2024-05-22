import axios from 'axios'
import { BASE_URL } from '../../../../apiConfig'

interface PostCode {
  password: string
  token: string | null
}

export default async function resetPassword(props: PostCode) {
  const { password, token} = props
  try {
    const response = await axios.put(
      `${BASE_URL}/auth/resetpassword/?token=${token}`, { password },
    )
    console.log('response', response.data)
    return response.data
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}