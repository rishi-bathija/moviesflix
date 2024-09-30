// src/utils/movieUtils.js
import { API_KEY } from './constants';

export const VideoData = async (movieId, category) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${category}/${movieId}/videos?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch videos for ${category} ID ${movieId}`);
        }
        const result = await response.json();
        // console.log("videodata", result.results);
        return result.results;
    } catch (error) {
        console.error("Error fetching cast info:", error);
        return [];
    }
};
