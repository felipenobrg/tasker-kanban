import axios from 'axios';
import { BASE_URL } from '../../../apiConfig';

interface PostSubtasksProps {
  boardName: string;
}

export default async function PostSubtasks(props: PostSubtasksProps) {
  const { boardName } = props;
  try {
    const response = await axios.post(`${BASE_URL}/subtasks`, { name: boardName }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error posting board:', error);
    throw error;
  }
}
