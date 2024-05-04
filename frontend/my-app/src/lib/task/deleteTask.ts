import axios from 'axios'
import { BASE_URL } from '../../../apiConfig';

interface DeleteTaskProps {
    id: number;
}

export default async function DeleteTask(props: DeleteTaskProps) {
    const { id } = props;
    try {
        const response = await axios.delete(`${BASE_URL}/tasks/${id}`);
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}
