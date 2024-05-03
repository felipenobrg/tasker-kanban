'use server'

import axios from 'axios'

interface GetTaskByIdProps {
  id: number | null
}

export default async function GetTaskById(props: GetTaskByIdProps) {
  const { id } = props
  try {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL is not defined in the environment variables')
    }
    const response = await axios.get(`${process.env.BASE_URL}/tasks/${id}`)
    console.log('RESPONSESS', response.data)
    return response.data.tasks
  } catch (error) {
    console.error('Error posting task:', error)
    throw error
  }
}
