// src/utils/movieUtils.js
import { API_KEY } from './constants';

export const getCastData = async (movieId, category) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${category}/${movieId}/credits?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cast info for ${category} ID ${movieId}`);
        }
        const result = await response.json();
        return result.cast;
    } catch (error) {
        console.error("Error fetching cast info:", error);
        return [];
    }
};
