import axios from 'axios'
import { BASE_URL } from '../../../apiConfig'

export interface UpdateSubtasksProps {
  id: number
  status: string
  name: string
}

export default async function UpdateSubtasks(props: UpdateSubtasksProps) {
  const { name, status, id } = props
  try {
    const response = await axios.put(`${BASE_URL}/subtasks/${id}`,
      { status, name },
      { withCredentials: true })
    return response.data
  } catch (error) {
    console.error('Error posting subtask:', error)
    throw error
  }
}
