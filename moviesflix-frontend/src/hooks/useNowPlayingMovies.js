import { useDispatch } from "react-redux";
import { addNowPlayingMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { buildTMDBUrl, fetchThroughProxy } from "../utils/tmdbProxy";

const useNowPlayingMovies = (listTitle, myTitle, selectedCategory) => {
    const dispatch = useDispatch();

    const getNowPlayingMovies = async () => {
        // const endpoint = selectedCategory === 'movie' ? 'movie/now_playing' : 'tv/on_the_air';
        const url = buildTMDBUrl('/movie/now_playing', { language: 'en-US', page: 1 });
        const data = await fetchThroughProxy(url);
        const json = await data.json();
        dispatch(addNowPlayingMovies(json.results));
    };

    useEffect(() => {
        if (listTitle !== myTitle) return;
        getNowPlayingMovies();
    }, [selectedCategory, listTitle, myTitle]);

    // return { selectedCategory };
};

export default useNowPlayingMovies;
