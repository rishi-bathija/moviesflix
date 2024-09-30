import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import VideoTtile from './VideoTtile';
import { VideoBackground } from './VideoBackground';
import './loginStyle.css'
import { API_OPTIONS } from '../utils/constants';


const MainContainer = memo(() => {
    // const movies = useSelector(store => store.movies?.nowPlayingMovies);
    const [randomMovieIndex, setRandomMovieIndex] = useState(null);
    const [result, setResult] = useState(null);

    const getNowPlayingMovies = async () => {
        const data = await fetch('https://api.themoviedb.org/3/movie/now_playing?page=1', API_OPTIONS);
        const result = await data.json();
        // console.log("Now Playing Movies", result?.results);
        setResult(result);
        setRandomMovieIndex(Math.floor(Math.random() * Math.min(5, result?.results.length)));
        // onMainContainerLoad();
    }

    useEffect(() => {
        getNowPlayingMovies();
    }, []);


    if (!result || !result?.results || randomMovieIndex === null) return <div className='text-white'>Loading...</div>;
    // do above step or do optional chaining as done below on movies array
    const mainMovie = result?.results[randomMovieIndex];
    // console.log(mainMovie);
    return (
        <div className='pt-[30%] bg-black md:pt-0'>
            <VideoTtile title={mainMovie?.title} overview={mainMovie?.overview} movieId={mainMovie?.id} />
            <VideoBackground movieId={mainMovie?.id} />
        </div>
    )
})

export default MainContainer
