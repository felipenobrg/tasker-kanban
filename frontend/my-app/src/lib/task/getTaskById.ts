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
    console.log('RESPONSESS', response.data)
    return response.data.tasks
  } catch (error) {
    console.error('Error posting task:', error)
    throw error
  }
}
