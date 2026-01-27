import { useDispatch } from "react-redux";
import { addTopRatedMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { buildTMDBUrl, fetchThroughProxy } from "../utils/tmdbProxy";

const useTopRatedMovies = (listTitle, myTitle, selectedCategory) => {
    const dispatch = useDispatch();

    const getTopRatedMovies = async () => {
        const url = buildTMDBUrl(`/${selectedCategory}/top_rated`, { language: 'en-US', page: 1 });
        const data = await fetchThroughProxy(url);
        const json = await data.json();
        dispatch(addTopRatedMovies(json.results));
    };

    useEffect(() => {
        if (listTitle !== myTitle) return;
        getTopRatedMovies();
    }, [selectedCategory, listTitle, myTitle]);

    // return { selectedCategory };
};

export default useTopRatedMovies;