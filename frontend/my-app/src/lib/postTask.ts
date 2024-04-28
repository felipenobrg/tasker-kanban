"use server"

import axios from 'axios'

interface PostTaskProps {
    description: string;
    status: string;
}

export default async function PostTask(props: PostTaskProps) {
    const { description, status } = props;
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }
        const response = await axios.post(`${process.env.BASE_URL}/add`, { description, status });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}
