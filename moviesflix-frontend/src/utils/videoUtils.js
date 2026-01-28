// src/utils/movieUtils.js
import { API_KEY } from './constants';
import { buildTMDBUrl, fetchThroughProxy } from './tmdbProxy';

export const VideoData = async (movieId, category) => {
    try {
        const url = buildTMDBUrl(`/${category}/${movieId}/videos`);
        const response = await fetchThroughProxy(url);
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
