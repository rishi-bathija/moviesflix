import React, { useEffect, useState } from 'react'
import { API_OPTIONS } from '../utils/constants'
import './loginStyle.css'
// import { useDispatch, useSelector } from 'react-redux';
import { addTrailerVideo } from '../utils/movieSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ReactPlayer from 'react-player/youtube';


const getTrailerBackground = async (movieId, dispatch) => {
    try {
        const data = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, API_OPTIONS);
        const result = await data.json();
        console.log(result.results);

        const fiterData = result.results.filter((video) => video.type === "Trailer");
        const trailer = fiterData.length ? fiterData[0] : result?.results[0];
        console.log(trailer);

        // setTrailer(trailer.key);
        dispatch(addTrailerVideo(trailer.key));
    } catch (error) {
        console.error('Error fetching movie videos:', error);
    }

    // dispatch(addTrailerVideo(trailer));
}


const getMovieVideos = async (movieId, selectedCategory, setTrailerId) => {
    try {
        let apiUrl;
        if (selectedCategory === "movie") {
            apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
        } else if (selectedCategory === "tv") {
            apiUrl = `https://api.themoviedb.org/3/tv/${movieId}/videos?language=en-US`;
        } else {
            console.error('Invalid media type. Use "movie" or "tv".');
            return;
        }

        const data = await fetch(apiUrl, API_OPTIONS);
        const result = await data.json();
        console.log(result.results);

        const filteredData = result.results.filter((video) => video.type === "Trailer");
        const trailer = filteredData.length ? filteredData[0] : result?.results[0];
        console.log(trailer);

        setTrailerId(trailer.key);
    } catch (error) {
        console.error(`Error fetching ${selectedCategory} videos:`, error);
    }
};

// dispatch(addTrailerVideo(trailer));


// console.log('Trailer Video Key:', trailerVideo?.key);
// to show the trailer of different movies, 1) you can either use the useState hook to change the movie trailer accordingly, OR 2) you can put the trailer into the store, and get it from there when required

const VideoBackground = ({ movieId }) => {
    // fetch trailer 

    const [trailerId, setTrailerId] = useState(null);
    const trailerVideo = useSelector(store => store.movies?.trailerVideo);
    const dispatch = useDispatch();

    useEffect(() => {
        getMovieVideos(movieId, setTrailerId);
    }, [movieId]);
    useEffect(() => {
        getTrailerBackground(movieId, dispatch);
    }, [movieId, dispatch]);

    return (
        <>
            {/* <div className='w-screen'>
                <iframe className='w-screen aspect-video' src={`https://www.youtube.com/embed/${trailerVideo}?autoplay=1&mute=1&controls=0&loop=1`
                } title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div> */}

            <div className='w-screen aspect-video'>
                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${trailerVideo}`}
                    playing={true} // Auto play
                    controls={false} // Show video controls
                    muted={true}
                    loop={true}
                    width='100%'
                    height='100%'

                />
            </div>
        </>
    )
}

export { VideoBackground, getMovieVideos };