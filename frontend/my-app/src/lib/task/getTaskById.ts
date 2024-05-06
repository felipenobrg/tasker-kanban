import axios from 'axios'
import { BASE_URL } from '../../../apiConfig'

interface GetTaskByIdProps {
  id: number | null
}

export default async function GetTaskById(props: GetTaskByIdProps) {
  const { id } = props
  try {
    const response = await axios.get(`${BASE_URL}/tasks/${id}`, {
      withCredentials: true
    })
    return response.data.data
  } catch (error) {
    console.error('Error posting task:', error)
    throw error
  }
}
