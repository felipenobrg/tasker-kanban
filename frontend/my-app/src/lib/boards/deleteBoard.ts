"use server"

import axios from 'axios'

interface DeleteBoardProps {
    id: number
}

export default async function DeleteBoard(props: DeleteBoardProps) {
    const { id } = props
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }
        const response = await axios.delete(`${process.env.BASE_URL}/boards/${id}`);
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}