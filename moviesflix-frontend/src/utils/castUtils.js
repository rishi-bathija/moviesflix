// src/utils/movieUtils.js
import { API_KEY } from './constants';
import { buildTMDBUrl, fetchThroughProxy } from './tmdbProxy';

export const getCastData = async (movieId, category) => {
    try {
        const url = buildTMDBUrl(`/${category}/${movieId}/credits`);
        const response = await fetchThroughProxy(url);
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
