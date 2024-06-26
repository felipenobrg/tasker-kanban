import axios from 'axios'
import { BASE_URL } from '../../../apiConfig';

interface GetSubtaskById {
    id: number | undefined
}

export default async function GetSubtaskById(props: GetSubtaskById) {
    const { id } = props
    try {
        const response = await axios.get(`${BASE_URL}/subtasks?taskId=${id}`, 
        { withCredentials: true });
        return response.data.data;
    } catch(error) {
        console.error('Error fetching tasks:', error);
        throw error; 
    }
}
