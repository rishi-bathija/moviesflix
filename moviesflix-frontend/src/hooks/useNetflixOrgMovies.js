import { useDispatch } from "react-redux";
import { addNetflixOrgMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { buildTMDBUrl, fetchThroughProxy } from "../utils/tmdbProxy";

const useNetflixOrgMovies = (listTitle, myTitle, selectedCategory) => {
    const dispatch = useDispatch();

    const getNetflixOrgMovies = async () => {
        const url = buildTMDBUrl(`/discover/${selectedCategory}`, { with_networks: 213, language: 'en-US', page: 1, sort_by: 'vote_count.desc' });
        const data = await fetchThroughProxy(url);
        const json = await data.json();
        dispatch(addNetflixOrgMovies(json.results));
    };

    useEffect(() => {
        if (listTitle !== myTitle) return;
        getNetflixOrgMovies();
    }, [selectedCategory, listTitle, myTitle]);

    // return { selectedCategory };
};

export default useNetflixOrgMovies;
    