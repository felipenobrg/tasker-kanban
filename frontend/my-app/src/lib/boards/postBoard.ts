"use server"

import axios from 'axios'

interface PostBoardProps {
    boardName: string;
}

export default async function PostBoard(props: PostBoardProps) {
    const { boardName } = props;
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }
        const response = await axios.post(`${process.env.BASE_URL}/boards/add`, { name: boardName });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}
