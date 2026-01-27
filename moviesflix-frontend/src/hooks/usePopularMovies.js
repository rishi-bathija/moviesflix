import { useDispatch } from "react-redux";
import { addPopularMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { buildTMDBUrl, fetchThroughProxy } from "../utils/tmdbProxy";

const usePopularMovies = (listTitle, myTitle,selectedCategory) => {
    const dispatch = useDispatch();

    const getPopularMovies = async () => {
        const url = buildTMDBUrl(`/${selectedCategory}/popular`, { page: 1 });
        const data = await fetchThroughProxy(url);
        const json = await data.json();
        dispatch(addPopularMovies(json.results));
    };

    useEffect(() => {
        if (listTitle !== myTitle) return;
        getPopularMovies();
    }, [selectedCategory, listTitle, myTitle]);

    // return { selectedCategory };
};

export default usePopularMovies;
