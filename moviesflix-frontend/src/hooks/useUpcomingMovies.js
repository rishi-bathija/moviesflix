import { useDispatch } from "react-redux";
import { addUpcomingMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";

const useUpcomingMovies = () => {
    const dispatch = useDispatch();

    // fetch the data frm API and put it into the store
    const getUpcomingMovies = async () => {
        const data = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', API_OPTIONS);
        const result = await data.json();
        console.log("Trending", result.results);
        dispatch(addUpcomingMovies(result.results));
    }

    useEffect(() => {
        getUpcomingMovies();
    }, [])
}

export default useUpcomingMovies;