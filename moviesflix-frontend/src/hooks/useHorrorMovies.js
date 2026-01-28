import { useDispatch } from "react-redux";
import { addHorrorMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { buildTMDBUrl, fetchThroughProxy } from "../utils/tmdbProxy";

const useHorrorMovies = () => {
    const dispatch = useDispatch();

    // fetch the data frm API and put it into the store
    const getHorrorMovies = async () => {
        const url = buildTMDBUrl('/discover/movie', { language: 'en-US', with_genres: 27, page: 1, sort_by: 'vote_count.desc' });
        const data = await fetchThroughProxy(url);
        const json = await data.json();
        // console.log("Horror", json.results);
        dispatch(addHorrorMovies(json.results));
    }

    useEffect(() => {
        getHorrorMovies();
    }, [])
}

export default useHorrorMovies;