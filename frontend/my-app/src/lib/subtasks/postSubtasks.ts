import axios from 'axios';
import { BASE_URL } from '../../../apiConfig';

interface PostSubtasksProps {
    name: string;
    status: string
    task_id: number | null
}

export default async function PostSubtask(props: PostSubtasksProps) {
  const { name, status, task_id } = props;
  try {
    const response = await axios.post(
      `${BASE_URL}/subtasks`,
      {
        name,
        status,
        task_id,
      },
      { withCredentials: true }
    );
    console.log("SUBTASKDATA", response.data)
    return response.data;
  } catch (error) {
    console.error('Error posting task:', error);
    throw error;
  }
}
