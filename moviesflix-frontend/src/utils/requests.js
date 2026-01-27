import { API_KEY } from "./constants";

const requests = {
    fetchAction: `/discover/movie?with_genres=28`,
    fetchActionTV: `/discover/tv?with_genres=10759`,
    fetchComedy: `/discover/movie?with_genres=35`,
    fetchComedyTV: `/discover/tv?with_genres=35`,
    fetchTrending: `/trending/all/day?language=en-US`,
    fetchTrendingTV: `/trending/all/week?language=en-US`
};

export default requests;
