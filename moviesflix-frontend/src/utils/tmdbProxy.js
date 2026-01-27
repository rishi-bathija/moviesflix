import { CLOUDFLARE_PROXY_URL } from './constants';

/**
 * Fetches data from TMDB API through Cloudflare Worker proxy
 * @param {string} url - The full TMDB API URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>}
 */
export const fetchThroughProxy = async (url, options = {}) => {
    const encodedUrl = encodeURIComponent(url);
    const proxyUrl = `${CLOUDFLARE_PROXY_URL}?url=${encodedUrl}`;
    
    return fetch(proxyUrl, {
        method: options.method || 'GET',
        headers: {
            ...options.headers,
        },
        body: options.body,
    });
};

/**
 * Helper function to build TMDB API URL
 * @param {string} endpoint - API endpoint (e.g., '/movie/now_playing')
 * @param {object} params - Query parameters
 * @returns {string} - Full TMDB API URL
 */
export const buildTMDBUrl = (endpoint, params = {}) => {
    const baseURL = 'https://api.themoviedb.org/3';
    const url = new URL(`${baseURL}${endpoint}`);
    
    // Add API key if not already in params
    // if (!params.api_key && !endpoint.includes('api_key')) {
    //     params.api_key = process.env.REACT_APP_API_KEY;
    // }
    
    // Add all params to URL
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });
    
    return url.toString();
};