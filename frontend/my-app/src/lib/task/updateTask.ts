import axios from 'axios'
import { BASE_URL } from '../../../apiConfig'

export interface UpdateTaskProps {
  description?: string
  status: string
  id: number
}

export default async function UpdateTask(props: UpdateTaskProps) {
  const { description, status, id } = props
  try {
    const response = await axios.put(`${BASE_URL}/tasks/${id}`,
      { description, status },
      { withCredentials: true })
    return response.data
  } catch (error) {
    console.error('Error posting task:', error)
    throw error
  }
}
