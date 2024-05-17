import axios from 'axios'
import { BASE_URL } from '../../../apiConfig';

export default async function GetTask() {
    try {
        const response = await axios.get(`${BASE_URL}/tasks`, 
        { withCredentials: true });
        return response.data;
    } catch(error) {
        console.error('Error fetching tasks:', error);
        throw error; 
    }
}
