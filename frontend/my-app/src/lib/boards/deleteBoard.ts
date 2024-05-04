import axios from 'axios'
import { BASE_URL } from '../../../apiConfig';

interface DeleteBoardProps {
    id: number
}

export default async function DeleteBoard(props: DeleteBoardProps) {
    const { id } = props
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}