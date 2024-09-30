import { useDispatch } from "react-redux";
import { addTopRatedMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";

const useTopRatedMovies = (selectedCategory) => {
    const dispatch = useDispatch();

    const getTopRatedMovies = async () => {
        const data = await fetch(`https://api.themoviedb.org/3/${selectedCategory}/top_rated?language=en-US&page=1`, API_OPTIONS);
        const result = await data.json();
        dispatch(addTopRatedMovies(result.results));
    };

    useEffect(() => {
        getTopRatedMovies();
    }, [selectedCategory]);

    // return { selectedCategory };
};

export default useTopRatedMovies;