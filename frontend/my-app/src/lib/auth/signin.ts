import axios from 'axios'
import { BASE_URL } from '../../../apiConfig'

interface SigninProps {
    name: string
    email: string
    password: string
}

export default async function SigninAuth(props: SigninProps) {
    const { email, password, name } = props
    try {
        const response = await axios.post(`${BASE_URL}/singin`, { email, password, name });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}