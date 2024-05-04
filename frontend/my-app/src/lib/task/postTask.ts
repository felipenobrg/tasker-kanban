"use server"

import axios from 'axios'

interface PostTaskProps {
    description: string;
    status: string;
    board_id: number;
}

export default async function PostTask(props: PostTaskProps) {
    const { description, status, board_id } = props;
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }
        const response = await axios.post(`${process.env.BASE_URL}/tasks/add`, { board_id, description, status });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}
