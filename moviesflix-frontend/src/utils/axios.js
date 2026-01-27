import axios from "axios";
import { CLOUDFLARE_PROXY_URL } from "./constants";

const instance = axios.create({
    baseURL: CLOUDFLARE_PROXY_URL,
});

instance.interceptors.request.use(
    (config) => {
        // If the request is to the proxy base URL, we need to add the url parameter
        if (config.url && !config.url.startsWith('http')) {
            // Build the full TMDB URL
            const tmdbBaseUrl = "https://api.themoviedb.org/3";
            const fullUrl = `${tmdbBaseUrl}${config.url}`;
            
            // Add query params if any
            if (config.params) {
                const urlObj = new URL(fullUrl);
                Object.keys(config.params).forEach(key => {
                    urlObj.searchParams.append(key, config.params[key]);
                });
                config.url = `?url=${encodeURIComponent(urlObj.toString())}`;
            } else {
                config.url = `?url=${encodeURIComponent(fullUrl)}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance