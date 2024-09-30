// src/components/GenrePage.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_KEY, IMG_CDN } from '../utils/constants';
import dayjs from 'dayjs';
import noposter from './no-poster.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from './Spinner';

const GenrePage = () => {
    const { genreId, genreName } = useParams();
    const location = useLocation();
    const type = new URLSearchParams(location.search).get('type') || 'movie';
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const fetchMoviesByGenre = async (resetPage = false) => {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}&page=${resetPage ? 1 : page}`
            );
            if (resetPage) {
                setMovies(response.data.results);
                setPage(2);
            }
            else {
                setMovies(prevResults => [...prevResults, ...response.data.results]);
                setPage(prevPage => prevPage + 1);
            }
            setHasMore(response.data.page < response.data.total_pages);
        } catch (error) {
            setError('Failed to fetch movies.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMoviesByGenre(true);
    }, [genreId, type]);

    if (loading) {
        return <div className='text-white'>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='genre-page text-white bg-black min-h-screen w-screen p-4'>
            <h1 className='text-2xl font-bold mb-4'>{`${genreName} ${type === 'movie' ? 'Movies' : 'TV Shows'}`}</h1>
            <InfiniteScroll
                dataLength={movies.length}
                next={() => fetchMoviesByGenre(false)}
                hasMore={hasMore}
                loader={<Spinner />}
                endMessage={<p className='text-white text-2xl text-center font-bold'>No more results</p>}>
                <div className='movies-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className='movie-card cursor-pointer'
                            onClick={() => navigate(`/${movie.id}?type=${type}`)}
                        >
                            <img
                                src={movie.poster_path ? `${IMG_CDN}${movie.poster_path}` : noposter}
                                alt={movie.title || movie.name}
                                className='w-full h-auto rounded-lg mb-2'
                            />
                            <h3 className='text-lg font-bold'>{movie.title || movie.name}</h3>
                            <p className='text-sm text-gray-400'>{dayjs(movie.release_date || movie.first_air_date).format('MMM D, YYYY')}</p>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div >
    );
};

export default GenrePage;
