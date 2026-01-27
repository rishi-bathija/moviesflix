import { useDispatch } from "react-redux";
import { addUpcomingMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { buildTMDBUrl, fetchThroughProxy } from "../utils/tmdbProxy";

const useUpcomingMovies = () => {
    const dispatch = useDispatch();

    // fetch the data frm API and put it into the store
    const getUpcomingMovies = async () => {
        const url = buildTMDBUrl('/movie/upcoming', { language: 'en-US', page: 1 });
        const data = await fetchThroughProxy(url);
        const json = await data.json();
        // console.log("Trending", json.results);
        dispatch(addUpcomingMovies(json.results));
    }

    useEffect(() => {
        getUpcomingMovies();
    }, [])
}

export default useUpcomingMovies;