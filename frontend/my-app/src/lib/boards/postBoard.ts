import axios from 'axios'
import { BASE_URL } from '../../../apiConfig'

interface PostBoardProps {
  boardName: string
}

export default async function PostBoard(props: PostBoardProps) {
  const { boardName } = props
  try {
    const response = await axios.post(`${BASE_URL}/boards`, {
      name: boardName,
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error('Error posting task:', error)
    throw error
  }
}
