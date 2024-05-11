import axios from 'axios'
import { BASE_URL } from '../../../apiConfig'

export interface UpdateSubtasksProps {
  id: number
  description: string
}

export default async function UpdateSubtasks(props: UpdateSubtasksProps) {
  const { description, id } = props
  try {
    const response = await axios.put(`${BASE_URL}/subtasks/${id}`,
      { description },
      { withCredentials: true })
    return response.data
  } catch (error) {
    console.error('Error posting subtask:', error)
    throw error
  }
}
