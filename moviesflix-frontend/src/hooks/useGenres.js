import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGenres } from '../utils/movieSlice';
import { buildTMDBUrl, fetchThroughProxy } from '../utils/tmdbProxy';

const useGenres = () => {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.movies.genres);

  useEffect(() => {
    if (genres && Object.keys(genres).length > 0) return; // already loaded

    const loadGenres = async () => {
      try {
        const types = ['movie', 'tv'];
        const allGenres = {};

        for (const type of types) {
          const url = buildTMDBUrl(`/genre/${type}/list`);
          const response = await fetchThroughProxy(url);
          const json = await response.json();
          json.genres.forEach((g) => {
            allGenres[g.id] = g;
          });
        }

        dispatch(getGenres(allGenres));
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };

    loadGenres();
  }, [genres, dispatch]);
};

export default useGenres;