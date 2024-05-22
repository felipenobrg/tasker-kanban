import axios from 'axios';
import { BASE_URL } from '../../../apiConfig';

interface PostTaskProps {
  title: string;
  description: string;
  status: string;
  board_id: number | null;
  priority: string
}

export default async function PostTask(props: PostTaskProps) {
  const { title, description, priority, status, board_id } = props;
  try {
    const response = await axios.post(
      `${BASE_URL}/tasks`,
      {
        board_id,
        title,
        priority,
        status,
        description,
      },
      { withCredentials: true }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error('Error posting task:', error);
    throw error;
  }
}
