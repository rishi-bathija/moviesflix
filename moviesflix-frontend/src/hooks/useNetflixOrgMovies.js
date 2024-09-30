import { useDispatch } from "react-redux";
import { addNetflixOrgMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";

const useNetflixOrgMovies = (selectedCategory) => {
    const dispatch = useDispatch();

    const getNetflixOrgMovies = async () => {
        const data = await fetch(`https://api.themoviedb.org/3/discover/${selectedCategory}?with_networks=213&language=en-US&page=1&sort_by=vote_count.desc`, API_OPTIONS);
        const result = await data.json();
        dispatch(addNetflixOrgMovies(result.results));
    };

    useEffect(() => {
        getNetflixOrgMovies();
    }, [selectedCategory]);

    // return { selectedCategory };
};

export default useNetflixOrgMovies;
