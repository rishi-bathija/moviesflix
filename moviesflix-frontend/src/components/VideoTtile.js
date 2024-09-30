import React from 'react'
// Import necessary components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsMovieTrailer, setSelectedVideoId } from '../utils/movieSlice';


const VideoTtile = ({ title, overview, movieId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleClick = async () => {
        dispatch(setIsMovieTrailer(false));
        dispatch(setSelectedVideoId(false));
        navigate('/player');
    }
    return (
        <div className="w-screen aspect-video pt-[20%] md:px-16 px-6 absolute bg-gradient-to-r from-black">
            <h1 className="text-2xl md:text-4xl font-bold text-white">{title}</h1>
            <p className="hidden md:inline-block py-4 text-lg mt-2 max-w-screen-sm text-white">{overview}</p>
            <div className="flex mt-4">
                <button className="mr-4 bg-red-500 px-2 py-1 md:px-4 md:py-2 rounded hover:bg-red-600 focus:outline-none text-white text-center text-md" onClick={handleClick}>
                    <FontAwesomeIcon icon={faPlay} className="mr-2" />
                    Play
                </button>
                <Link to={`/${movieId}?type=movie`} className="hidden md:inline-block bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 focus:outline-none text-white text-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    More Info
                </Link>
            </div>
        </div>
    )
}

export default VideoTtile
