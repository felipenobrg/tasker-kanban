"use server"

"use server"

import axios from 'axios'

export default async function GetTask() {
    try {
        if (!process.env.BASE_URL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }

        const response = await axios.get(process.env.BASE_URL);
        return response.data.data;
    } catch(error) {
        console.error('Error fetching tasks:', error);
        throw error; 
    }
}
