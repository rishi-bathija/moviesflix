import { useDispatch } from "react-redux";
import { addPopularMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";

const usePopularMovies = (selectedCategory) => {
    const dispatch = useDispatch();

    const getPopularMovies = async () => {
        const data = await fetch(`https://api.themoviedb.org/3/${selectedCategory}/popular?page=1`, API_OPTIONS);
        const result = await data.json();
        dispatch(addPopularMovies(result.results));
    };

    useEffect(() => {
        getPopularMovies();
    }, [selectedCategory]);

    // return { selectedCategory };
};

export default usePopularMovies;
