import { useDispatch } from "react-redux";
import { addHorrorMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";

const useHorrorMovies = () => {
    const dispatch = useDispatch();

    // fetch the data frm API and put it into the store
    const getHorrorMovies = async () => {
        const data = await fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=27&page=1&sort_by=vote_count.desc`, API_OPTIONS);
        const result = await data.json();
        console.log("Horror", result.results);
        dispatch(addHorrorMovies(result.results));
    }

    useEffect(() => {
        getHorrorMovies();
    }, [])
}

export default useHorrorMovies;