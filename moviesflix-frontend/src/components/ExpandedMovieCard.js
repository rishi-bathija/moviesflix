import React, { useState, useEffect } from 'react';
import { API_KEY, IMG_CDN } from '../utils/constants';
import './expandedStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePlus, faCircleInfo, faCheck, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addMovieVideo, getGenres, setIsMovieTrailer } from '../utils/movieSlice';
import { getMovieVideos } from './VideoBackground';
import './loginStyle.css';
import { useNavigate } from 'react-router-dom';
import { handleAddToWatchlist, handleRemoveFromWatchlist } from '../utils/watchlistUtils';
import { auth } from '../utils/firebase';

const ExpandedMovieCard = ({ movie, backdropPath, selectedCategory, isMobileView }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [trailerId, setTrailerId] = useState(null);
    const dispatch = useDispatch();
    const watchlist = useSelector((state) => state.movies.watchlist);
    const isInWatchlist = watchlist.some((item) => item.id === movie.id);

    const genresCall = async () => {
        try {
            const endPoints = ["tv", "movie"];
            let allGenres = {};

            for (const url of endPoints) {
                const response = await fetch(`https://api.themoviedb.org/3/genre/${url}/list?api_key=${API_KEY}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch genres for ${url}`);
                }
                const data = await response.json();
                const { genres } = data;

                genres.forEach((item) => (allGenres[item.id] = item));
            }

            dispatch(getGenres(allGenres));
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    useEffect(() => {
        genresCall();
    }, []);

    const handleMovieHover = () => {
        if (!isMobile()) {
            // Call the getMovieVideos function with the movie's id
            getMovieVideos(movie.id, selectedCategory, setTrailerId);
        }
    };

    const handlePlayClick = async () => {
        await getMovieVideos(movie.id, selectedCategory, (trailerId) => {
            dispatch(addMovieVideo(trailerId));
            dispatch(setIsMovieTrailer(true));
            navigate('/player');
        });
    };

    const handleCardClick = () => {
        // console.log("clicked");
        navigate(`/${movie.id}?type=${selectedCategory}`);
    };

    const isMobile = () => {
        return window.innerWidth <= 768; // Adjust the threshold as needed
    };

    const handleAddToWatchlistClick = () => {
        handleAddToWatchlist(auth, movie, selectedCategory, dispatch);
    };

    const handleRemoveFromWatchlistClick = () => {
        handleRemoveFromWatchlist(auth, movie, dispatch);
    };

    return (
        <div className={`expanded-hover ${isMobile() ? 'mobile' : 'desktop'}`} onMouseEnter={!isMobile() ? handleMovieHover : undefined} onClick={isMobile() ? handleCardClick : undefined} >
            <div className="expanded-image-video-container">
                <img src={IMG_CDN + backdropPath} alt={movie.title || movie.name} title={movie.title || movie.name} />
                {trailerId && (
                    <iframe
                        src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                )}
            </div>
            <div className="expanded-info-container text-white">
                <h1 className="text-4xl font-bold mb-4">{(movie?.title && movie.title.length > 20 ? movie.title.substring(0, 20) + '...' : movie.title) || (movie.name.length > 20 ? movie.name.substring(0, 20) + '...' : movie.name)}</h1>
                <div className='flex gap-2 cursor-pointer'>
                    <div className="text-2xl font-bold" onClick={handlePlayClick} >
                        <FontAwesomeIcon icon={faCirclePlay} title='play' />
                        <span>Play</span>
                    </div>
                    <div className="icons flex gap-1">
                        {isInWatchlist ?
                            <FontAwesomeIcon icon={faCheck} title='Remove from watchlist' onClick={handleRemoveFromWatchlistClick} /> : <FontAwesomeIcon icon={faPlusCircle} title='Add to watchlist' onClick={handleAddToWatchlistClick} />
                        }
                        <FontAwesomeIcon icon={faCircleInfo} title='More Info' onClick={() => navigate(`/${movie.id}?type=${selectedCategory}`)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpandedMovieCard;
