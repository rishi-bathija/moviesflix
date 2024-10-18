import React, { useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import MovieListRedux from './MovieListRedux';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatchlist } from '../utils/watchlistUtils';
import Spinner from './Spinner';

const UserMovies = () => {
    const dispatch = useDispatch();
    const watchlist = useSelector((state) => state.movies.watchlist);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check the authentication state before fetching the watchlist
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchWatchlist(auth, dispatch)
                    .then(() => setLoading(false))
                    .catch(() => setLoading(false));
            } else {
                console.error('User not authenticated');
                // If you have a loading state or other actions to handle the unauthenticated state, manage them here
                setLoading(false);
            }
        });

        // Cleanup the subscription
        return () => unsubscribe();
    }, [dispatch]);


    // Filter watchlist into movies and TV shows
    const movies = watchlist.filter(item => (item.media_type ? item.media_type : item.selectedCategory) === 'movie');
    const tvShows = watchlist.filter(item => (item.media_type ? item.media_type : item.selectedCategory) === 'tv');
    // console.log('movie', movies);
    // console.log('tv', tvShows);


    return (
        <div className='bg-black text-white h-screen w-screen overflow-x-hidden'>
            <div className="watchlist">
                {loading ? (<Spinner />) : (movies.length > 0 ? (
                    <MovieListRedux title={"Watchlist Movies"} movies={movies} userSelected={'movie'} isAdded={'true'} />
                ) : (
                    <p className='text-2xl flex justify-center items-center h-[200px]'>No movies in your watchlist.</p>
                ))}

                {loading ? (<Spinner />) : (tvShows.length > 0 ? (
                    <MovieListRedux title={"Watchlist TV Shows"} movies={tvShows} userSelected={'tv'} isAdded={'true'} />
                ) : (
                    <p className='text-2xl flex justify-center items-center h-[200px]'>No TV shows in your watchlist.</p>
                ))}

            </div>
        </div>
    );
};

export default UserMovies;
