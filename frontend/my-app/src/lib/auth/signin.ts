import axios from 'axios';
import { BASE_URL } from '../../../apiConfig';

interface SigninProps {
    name: string;
    email: string;
    password: string;
}

export default async function SigninAuth(props: SigninProps) {
    const { email, password, name } = props;
    try {
        const response = await axios.post(`${BASE_URL}/signin`, { email, password, name }, { withCredentials: true });
        return response.data;
    } catch(error) {
        console.error('Error signing in:', error);
        throw error;
    }
}
