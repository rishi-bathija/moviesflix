import { API_KEY } from "./constants";

const requests = {
    fetchAction: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchActionTV: `/discover/tv?api_key=${API_KEY}&with_genres=10759`,
    fetchComedy: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchComedyTV: `/discover/tv?api_key=${API_KEY}&with_genres=35`,
    fetchTrending: `/trending/all/day?api_key=${API_KEY}&language=en-US`,
    fetchTrendingTV: `/trending/all/week?api_key=${API_KEY}&language=en-US`
};

export default requests;
