import axios from 'axios';
import { BASE_URL } from '../../../apiConfig';

interface LoginAuthProps {
    email: string;
    password: string;
}

export default async function LoginAuth(props: LoginAuthProps) {
    const { email, password } = props;
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, { email, password },
        { withCredentials: true });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}
