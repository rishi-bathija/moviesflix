import React, { useEffect, useState } from 'react';
import { API_KEY, IMG_CDN } from '../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faThumbsUp, faThumbsDown, faCheck, faPlus, faChevronDown, faChevronUp, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieVideos } from './VideoBackground';
import { Link, useNavigate } from 'react-router-dom';
import { addMovieVideo, setIsMovieTrailer, getGenres, addToWatchlist, removeFromWatchlist } from '../utils/movieSlice';
import { getCastData } from '../utils/castUtils';
import { auth } from '../utils/firebase';
import { handleAddToWatchlist, handleRemoveFromWatchlist } from '../utils/watchlistUtils';
import './loginStyle.css'

const MovieCard = ({ posterPath, altText, movie, selectedCategory, isMobileView, isAdded, mediaType }) => {

    const [isLiked, setIsLiked] = useState(isAdded === 'true');
    const [isHovered, setIsHovered] = useState(false);
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [trailerId, setTrailerId] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const [cast, setCast] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const watchlist = useSelector((state) => state.movies.watchlist);
    const isInWatchlist = watchlist.some((item) => item.id === movie.id);

    const mediaTypeOrCategory = mediaType || selectedCategory; // Use mediaType if available, otherwise use selectedCategory


    useEffect(() => {
        const fetchGenres = async () => {
            try {
                let allGenres = {};
                const response = await fetch(`https://api.themoviedb.org/3/genre/${mediaTypeOrCategory}/list?api_key=${API_KEY}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch genres for ${mediaType ? mediaType : selectedCategory}`);
                }
                const data = await response.json();
                const { genres } = data;
                genres.forEach((item) => (allGenres[item.id] = item));
                dispatch(getGenres(allGenres));
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, [dispatch, mediaType, selectedCategory]);

    useEffect(() => {
        if (isHovered) {
            getCastData(movie.id, mediaType ? mediaType : selectedCategory).then(setCast);
        }
    }, [isHovered, mediaType, selectedCategory, movie.id]);

    const handleMovieHover = () => {
        getMovieVideos(movie.id, mediaType ? mediaType : selectedCategory, setTrailerId);
    };

    const handlePlayClick = async () => {
        await getMovieVideos(movie.id, mediaType ? mediaType : selectedCategory, (trailerId) => {
            dispatch(addMovieVideo(trailerId));
            dispatch(setIsMovieTrailer(true));
            navigate('/player');
        });
    };

    const toggleOverview = () => {
        setShowOverview(!showOverview);
    };

    const handleCardClick = () => {
        navigate(`/${movie.id}?type=${mediaType ? mediaType : selectedCategory}`);
    };

    const handleAddToWatchlistClick = () => {
        handleAddToWatchlist(auth, movie, selectedCategory, dispatch);
    };

    const handleRemoveFromWatchlistClick = () => {
        handleRemoveFromWatchlist(auth, movie, dispatch);
    };

    const { genres } = useSelector((state) => state.movies);
    const _genres = movie?.genre_ids;

    const handleGenreClick = (genreId, genreName) => {
        navigate(`/genre/${genreId}/${genreName}?type=${selectedCategory}`);
    };

    if (!posterPath) {
        return null;
    }

    // console.log('selectedcategory', selectedCategory);

    return (
        <div className={`movieCard`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={isMobileView ? handleCardClick : undefined}>
            <img src={IMG_CDN + posterPath} alt={altText} title={altText} />
            {isHovered && <div className="hover" onMouseEnter={handleMovieHover}>
                <div className="image-video-container" onMouseEnter={() => setIsImageHovered(true)} onMouseLeave={() => setIsImageHovered(false)}>
                    <img src={IMG_CDN + movie.backdrop_path} alt={movie?.title || movie?.name} />
                    {isImageHovered && trailerId && <iframe
                        className='w-full h-[150] object-cover rounded-3 absolute top-0 z-10 aspect-auto' src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />}
                </div>
                <div className="info-container text-white flex flex-col">
                    <h3 className="name">{(movie?.title && movie.title.length > 20 ? movie.title.substring(0, 20) + '...' : movie.title) || (movie.name.length > 20 ? movie.name.substring(0, 20) + '...' : movie.name)}</h3>
                    <div className="icons flex justify-between">
                        <div className="controls flex">
                            <FontAwesomeIcon icon={faPlay} title='play' onClick={handlePlayClick} />
                            <FontAwesomeIcon icon={faThumbsUp} title='like' />
                            <FontAwesomeIcon icon={faThumbsDown} title='dislike' />
                            <Link to={`/${movie.id}?type=${mediaType ? mediaType : selectedCategory}`}>
                                <FontAwesomeIcon icon={faCircleInfo} title='More Info' />
                            </Link>
                            {isInWatchlist ? (
                                <FontAwesomeIcon icon={faCheck} title='Remove from list' onClick={handleRemoveFromWatchlistClick} />
                            ) : (
                                <FontAwesomeIcon icon={faPlus} title='Add to my list' onClick={handleAddToWatchlistClick} />
                            )}
                        </div>
                        <div className="info">
                            {showOverview ? (
                                <FontAwesomeIcon icon={faChevronUp} title='Less Info' onClick={toggleOverview} />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} title='More Info' onClick={toggleOverview} />
                            )}
                        </div>
                    </div>
                    <div className="genres flex text-white">
                        <ul className="flex flex-wrap">
                            {Array.isArray(_genres) &&
                                _genres.slice(0, 3).map((g) => (
                                    <li key={g} className='text-white cursor-pointer' onClick={() => handleGenreClick(genres[g]?.id, genres[g]?.name)}>{genres && genres[g]?.name}</li>
                                ))}
                        </ul>
                    </div>
                    {showOverview && (
                        <>
                            <div className="overview my-2">
                                <p>{movie.overview.length > 80 ? movie.overview.substring(0, 80) + '...' : movie.overview}</p>
                            </div>
                            <div className="cast flex items-center">
                                <span>Top Cast:</span>
                                <ul className="flex space-x-2">
                                    {cast?.slice(0, 5).map((castMember) => (
                                        <li key={castMember.id}><img style={{ borderRadius: '50%', width: '3rem', height: '3rem' }} src={IMG_CDN + castMember.profile_path} title={castMember.name} alt="" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>}
        </div>
    );
};

export default MovieCard;
