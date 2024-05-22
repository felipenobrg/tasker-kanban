import axios from 'axios'
import { BASE_URL } from '../../../../apiConfig'

interface PostCode {
  email: string
  url: string
}

export default async function CheckEmail(props: PostCode) {
  const { email, url } = props
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/checkemail`,
      {
        email,
        url,
      },
    )
    console.log('response', response.data)
    return response.data
  } catch (error) {
    console.error("Error verifying user's email:", error)
    throw error
  }
}