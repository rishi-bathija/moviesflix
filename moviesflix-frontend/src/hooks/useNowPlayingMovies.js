import { useDispatch } from "react-redux";
import { addNowPlayingMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";

const useNowPlayingMovies = (selectedCategory) => {
    const dispatch = useDispatch();

    const getNowPlayingMovies = async () => {
        // const endpoint = selectedCategory === 'movie' ? 'movie/now_playing' : 'tv/on_the_air';
        const data = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`, API_OPTIONS);
        const result = await data.json();
        dispatch(addNowPlayingMovies(result.results));
    };

    useEffect(() => {
        getNowPlayingMovies();
    }, [selectedCategory]);

    // return { selectedCategory };
};

export default useNowPlayingMovies;
