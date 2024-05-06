import axios from 'axios'
import { BASE_URL } from '../../../apiConfig';

export default async function getSubtasks() {
    try {
        const response = await axios.get(`${BASE_URL}/subtasks`,{
            withCredentials: true
        });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}