import axios from 'axios';
import { BASE_URL } from '../../../apiConfig';

interface UpdateBoardProps {
  boardName: string;
}

export default async function UpdateBoard(props: UpdateBoardProps) {
  const { boardName } = props;
  try {
    const response = await axios.put(`${BASE_URL}/boards`, { name: boardName }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error posting board:', error);
    throw error;
  }
}
