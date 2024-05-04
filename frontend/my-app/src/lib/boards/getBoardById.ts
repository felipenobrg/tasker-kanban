"use server"

import axios from 'axios'

interface GetBoardById {
    id: number | null
}

export default async function GetBoardById(props: GetBoardById) {
    const { id } = props
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }
        const response = await axios.get(`${process.env.BASE_URL}/boards/${id}`);
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}