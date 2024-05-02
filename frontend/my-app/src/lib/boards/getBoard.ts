"use server"

import axios from 'axios'

export default async function getBoard() {
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }
        const response = await axios.get(`${process.env.BASE_URL}/boards`);
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}