"use server"

import axios from 'axios'

interface UpdateTaskProps {
    description?: string;
    status: string;
    id: number;
}

export default async function UpdateTask(props: UpdateTaskProps) {
    const { description, status, id } = props;
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }
        const response = await axios.put(`${process.env.BASE_URL}/tasks/update/${id}`, { description, status });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}
