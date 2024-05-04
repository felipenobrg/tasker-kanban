"use server"

import axios from 'axios'

interface DeleteTaskProps {
    id: number;
}

export default async function DeleteTask(props: DeleteTaskProps) {
    const { id } = props;
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }
        const response = await axios.delete(`${process.env.BASE_URL}/tasks/${id}`);
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}
