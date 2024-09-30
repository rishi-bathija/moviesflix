import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_KEY, IMG_CDN } from '../utils/constants';
import noposter from './no-poster.png';
import dayjs from 'dayjs';
import { faCheck, faCirclePlay, faPlay, faPlayCircle, faPlus, faStar, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getMovieVideos } from './VideoBackground';
import { useDispatch, useSelector } from 'react-redux';
import { addMovieVideo, addToWatchlist, removeFromWatchlist, setIsMovieTrailer, setSelectedVideoId } from '../utils/movieSlice';
import MovieListRedux from './MovieListRedux';
import { getCastData } from '../utils/castUtils';
import { VideoData } from '../utils/videoUtils';
import { auth } from '../utils/firebase';
import { handleAddToWatchlist, handleRemoveFromWatchlist } from '../utils/watchlistUtils';




const MoviePage = () => {
    const { id } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [crew, setCrew] = useState({ directors: [], producers: [], writers: [] });

    const [cast, setCast] = useState([]);
    const [videos, setVideos] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [episodes, setEpisodes] = useState({});
    const [activeTab, setActiveTab] = useState('details');
    const [activeSeason, setActiveSeason] = useState(1);
    const location = useLocation();
    const watchlist = useSelector((state) => state.movies.watchlist);
    const type = new URLSearchParams(location.search).get('type') || 'movie';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`
                );
                setMovieDetails(response.data);
                // Fetch season details if type is tv
                if (type === 'tv') {
                    const seasons = response.data.seasons.filter(season => season.season_number !== 0);
                    setSeasons(seasons);
                    fetchEpisodes(seasons);
                }
                // Fetch crew data
                const creditsResponse = await axios.get(
                    `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`
                );
                const crew = creditsResponse.data.crew;

                // Extract directors, producers, and writers
                const directors = crew.filter(member => member.job === 'Director');
                const producers = crew.filter(member => member.job === 'Producer');
                const writers = crew.filter(member => member.department === 'Writing');

                setCrew({ directors, producers, writers });


                // Fetch cast data
                const castData = await getCastData(id, type);
                setCast(castData);

                // fetch videos
                const videoData = await VideoData(id, type);
                // console.log("videos", videoData);
                setVideos(videoData)


                // Fetch related movies
                const relatedResponse = await axios.get(
                    `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${API_KEY}`
                );
                setRelatedMovies(relatedResponse.data.results);

                const similarResponse = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}`)
                setSimilarMovies(similarResponse.data.results)
            } catch (error) {
                setError('Failed to fetch movie details.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, type]);




    const fetchEpisodes = async (seasons) => {
        const episodesData = {};
        for (const season of seasons) {
            const seasonNumber = season.season_number;
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`);
            episodesData[seasonNumber] = response.data.episodes;
        }
        setEpisodes(episodesData);
    }

    if (loading) {
        return <div className='text-white'>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const formatRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m (${minutes} mins)`;
    };


    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating / 2);
        const halfStar = rating % 2 >= 1;
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesomeIcon icon={faStar} key={`full-${i}`} className="text-yellow-400" />);
        }
        if (halfStar) {
            stars.push(<FontAwesomeIcon icon={faStar} key={`half-${fullStars}`} className="text-yellow-400 opacity-50" />);
        }
        while (stars.length < 5) {
            stars.push(<FontAwesomeIcon icon={faStar} key={`empty-${stars.length}`} className="text-gray-400" />);
        }
        return stars;
    };


    const handlePlayClick = async () => {
        await getMovieVideos(id, type, (trailerId) => {
            dispatch(addMovieVideo(trailerId));
            dispatch(setIsMovieTrailer(true));
            navigate('/player');
        });
    };

    const handleVideoPlayClick = (videoId) => {
        dispatch(setSelectedVideoId(videoId));
        dispatch(setIsMovieTrailer(false)); // Ensure this is set to false if you're playing a different video
        navigate('/player');
    };

    const handleGenreClick = (genreId, genreName) => {
        navigate(`/genre/${genreId}/${genreName}?type=${type}`);
    };

    const handleAddToWatchlistClick = () => {
        handleAddToWatchlist(auth, movieDetails, type, dispatch);
    };

    const handleRemoveFromWatchlistClick = () => {
        handleRemoveFromWatchlist(auth, movieDetails, dispatch);
    };

    return (
        <>
            <div className="movie-details-container relative bg-black text-white min-h-screen flex flex-col md:flex-row w-full overflow-hidden pb-16">
                <div className="backdrop-img absolute top-0 left-0 w-full h-full">
                    {movieDetails.backdrop_path && (
                        <img
                            src={`${IMG_CDN}${movieDetails.backdrop_path}`}
                            alt={movieDetails.title}
                            className="w-full h-full object-cover object-top"
                        />
                    )}
                </div>
                {/* 79.17% */}
                <div className="opacity-layer w-full h-full absolute top-0 left-0" style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) -90%, rgba(0, 0, 0, 0.8) 90%)' }}></div>
                {movieDetails && (
                    <div className="movie-details flex flex-col md:flex-row items-center p-4 md:p-10 gap-4 md:gap-10 relative z-10 justify-center">
                        <div className="movie-poster w-full md:w-1/4 min-w-[200px]">
                            {movieDetails.poster_path ? (
                                <img src={`${IMG_CDN}${movieDetails.poster_path}`} alt={movieDetails.title} className="rounded-lg shadow-lg opacity-80" />
                            ) : (
                                <img src={noposter} alt="No poster available" className="rounded-lg shadow-lg" />
                            )}
                        </div>
                        <div className="movie-info w-full md:max-w-2xl">
                            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{movieDetails.title || movieDetails.name}</h1>
                            <p className="mb-4 md:mb-6">{movieDetails.overview}</p>
                            {/* Add more details or styling as needed */}
                            <div className="genre flex gap-2 flex-wrap mb-4 md:mb-6">
                                {movieDetails.genres.map(genre => {
                                    return <span key={genre.id} className='border border-gray-300 text-gray-300 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-white hover:text-black transition duration-300 ease-in-out' onClick={() => handleGenreClick(genre.id, genre.name)}>{genre.name}
                                    </span>
                                }
                                )}
                            </div>

                            <div className="ratings flex items-center mb-4 md:mb-6">
                                <div className="flex items-center">
                                    {renderStars(movieDetails.vote_average)}
                                </div>
                                <span className="ml-2 text-gray-300">{(movieDetails.vote_average / 2).toFixed(1)} / 5</span>
                            </div>

                            <div className='flex gap-2 flex-wrap'>
                                <p className="text-gray-400 mb-2 md:mb-4"><strong>Release Date: </strong>{dayjs(movieDetails.release_date).format('MMM D,YYYY') || dayjs(movieDetails.first_air_date).format('MMM D, YYYY')}</p>

                                {type === 'movie' ? (<p className="text-gray-400 mb-2 md:mb-4"><strong>Runtime:</strong> {formatRuntime(movieDetails.runtime)}</p>) : (<p className="text-gray-400 mb-2 md:mb-4"><strong>No. of seasons:</strong> {movieDetails.number_of_seasons} </p>)}

                                <p className="text-gray-400 mb-2 md:mb-4"><strong>Status:</strong> {movieDetails?.status}</p>
                            </div>

                            <div className="buttons mt-4 flex flex-wrap gap-4">
                                <button className='border-2 border-white rounded-lg flex items-center justify-center px-4 py-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4 hover:bg-white hover:text-black hover:border-black transition duration-300 ease-in-out cursor-pointer' onClick={handlePlayClick}>
                                    <FontAwesomeIcon icon={faPlay} /> <span className="hidden sm:inline">Play Trailer</span>
                                </button>
                                {watchlist.some(item => item.id === movieDetails.id) ?
                                    (<button className='border-2 border-white rounded-lg flex items-center justify-center px-4 py-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4 hover:bg-white hover:text-black hover:border-black transition duration-300 ease-in-out cursor-pointer' onClick={handleRemoveFromWatchlistClick} >
                                        <FontAwesomeIcon icon={faCheck} /> <span className="hidden sm:inline">Remove from watchlist</span>
                                    </button>)
                                    : (<button className='border-2 border-white rounded-lg flex items-center justify-center px-4 py-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4 hover:bg-white hover:text-black hover:border-black transition duration-300 ease-in-out cursor-pointer' onClick={handleAddToWatchlistClick} >
                                        <FontAwesomeIcon icon={faPlus} /> <span className="hidden sm:inline">Add to watchlist</span>
                                    </button>)
                                }
                                <button className='border-2 border-white rounded-lg flex items-center justify-center px-4 py-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4 hover:bg-white hover:text-black hover:border-black transition duration-300 ease-in-out cursor-pointer'>
                                    <FontAwesomeIcon icon={faThumbsUp} /> <span className="hidden sm:inline">Like</span>
                                </button>
                                <button className='border-2 border-white rounded-lg flex items-center justify-center px-4 py-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4 hover:bg-white hover:text-black hover:border-black transition duration-300 ease-in-out cursor-pointer'>
                                    <FontAwesomeIcon icon={faThumbsDown} /> <span className="hidden sm:inline">Not for me</span>
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
            <div className="relative -mt-16 bg-gradient-to-t from-black to-transparent z-10 overflow-hidden">
                <div className="tabs flex justify-center gap-2 sm:gap-4 pt-4">
                    <button
                        className={`px-2 py-1 sm:px-4 sm:py-2 text-white ${activeTab === 'details' ? 'border-b-2 border-white' : 'opacity-50'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`px-2 py-1 sm:px-4 sm:py-2 text-white ${activeTab === 'related' ? 'border-b-2 border-white' : 'opacity-50'}`}
                        onClick={() => setActiveTab('related')}
                    >
                        Related
                    </button>
                    {type === 'tv' && (
                        <button
                            className={`px-2 py-1 sm:px-4 sm:py-2 text-white ${activeTab === 'episodes' ? 'border-b-2 border-white' : 'opacity-50'}`}
                            onClick={() => setActiveTab('episodes')}
                        >
                            Episodes
                        </button>
                    )}
                </div>
                <div className="tab-content bg-black text-white p-4">
                    {activeTab === 'details' && (
                        <div className='w-full max-w-[1200px] mx-auto px-4 md:px-6'>
                            {type === 'movie' && (
                                <div className='flex flex-col md:flex-row justify-between'>
                                    <div className="moviePageCrew mt-6">
                                        <h2 className="text-xl font-bold mb-4">Directors</h2>
                                        <ul>
                                            {crew.directors.map((director) => (
                                                <li key={director.id}>{director.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="moviePageCrew mt-6">
                                        <h2 className="text-xl font-bold mb-4">Producers</h2>
                                        <ul>
                                            {crew.producers.map((producer) => (
                                                <li key={producer.id}>{producer.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="moviePageCrew mt-6">
                                        <h2 className="text-xl font-bold mb-4">Writers</h2>
                                        <ul>
                                            {crew.writers.map((writer) => (
                                                <li key={writer.id}>{writer.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {type === 'tv' && (
                                <div className='flex flex-col md:flex-row justify-between'>
                                    <div className="moviePageCrew mt-6">
                                        <h2 className="text-xl font-bold mb-4">Creators</h2>
                                        <ul>
                                            {crew.directors.map((creator) => (
                                                <li key={creator.id}>{creator.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="moviePageCrew mt-6">
                                        <h2 className="text-xl font-bold mb-4">Producers</h2>
                                        <ul>
                                            {crew.producers.map((producer) => (
                                                <li key={producer.id}>{producer.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="moviePageCrew mt-6">
                                        <h2 className="text-xl font-bold mb-4">Writers</h2>
                                        <ul>
                                            {crew.writers.map((writer) => (
                                                <li key={writer.id}>{writer.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            <div className="moviePageCast mt-6">
                                <h2 className="text-xl font-bold mb-4">Cast</h2>
                                <ul className='cast-list flex gap-5 md:gap-6 lg:gap-8 overflow-y-hidden'>
                                    {cast.map((castMember) => (
                                        <li key={castMember.id} className='cast-item flex flex-col items-center w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 mb-4'>
                                            <div className='cast-image-container w-[150px] h-[150px] sm:w-[175px] sm:h-[175px] rounded-full overflow-hidden mb-4 sm:mb-6'>
                                                <img className='cast-image w-full h-full object-cover' src={`${IMG_CDN}${castMember.profile_path}`} alt={castMember.name} />
                                            </div>
                                            <div className='cast-info text-center'>
                                                <p className='cast-name font-bold mt-2'>{castMember.name}</p>
                                                <p className='cast-character text-sm text-gray-500'>{castMember.character}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className='moviePage-videos mt-6'>
                                <h2 className='text-xl font-bold mb-4'>Official Videos</h2>
                                <ul className='video-list flex gap-5 overflow-x-auto'>
                                    {videos.map((video) => (
                                        <li key={video.id} className='video-item w-[75%] sm:w-[50%] md:w-[33%] lg:w-[25%] flex-shrink-0'>
                                            <div className="video-thumbnail mb-4 relative">
                                                <img src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`} className='w-full rounded-sm cursor-pointer' onClick={() => handleVideoPlayClick(video.key)} />
                                                <FontAwesomeIcon icon={faPlayCircle} className='w-[50px] h-[50px] absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer' onClick={() => handleVideoPlayClick(video.key)} />
                                            </div>
                                            <div className='video-info text-center'>
                                                <p className='video-name font-bold mt-2'>{video.name}</p>
                                                <p className='video-type text-sm text-gray-500'>{video.type}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'related' && (
                        <>
                            <MovieListRedux title={"Recommendations"} movies={relatedMovies} type={type} />
                            <MovieListRedux title={"Similar"} movies={similarMovies} type={type} />
                        </>
                    )}
                    {type === 'tv' && activeTab === 'episodes' && (
                        <div className='w-full max-w-[1200px] mx-auto px-4 md:px-6'>
                            <h2 className="text-xl font-bold mb-4">Seasons</h2>

                            <select onChange={(e) => setActiveSeason(Number(e.target.value))} className="mt-6 mb-6 p-2 bg-red-800 rounded text-white">
                                {seasons.map((season) => (
                                    <option key={season.id} value={season.season_number}>
                                        {season.name}
                                    </option>
                                ))}
                            </select>

                            <div>
                                {episodes[activeSeason] ? (
                                    <ul className='episode-list'>
                                        {episodes[activeSeason].map((episode) => (
                                            <li key={episode.id} className="mb-4 border-b pb-4">
                                                <div className="flex flex-col md:flex-row items-start">
                                                    <img
                                                        src={`${IMG_CDN}${episode.still_path || noposter}`}
                                                        alt={episode.name}
                                                        className="w-full md:w-44 h-32 md:h-18 mb-4 md:mb-0 mr-0 md:mr-4 rounded-md"
                                                    />
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className="text-md font-bold">Episode {episode.episode_number}: {episode.name}</h4>
                                                        <p className="text-gray-400">{dayjs(episode.air_date).format('MMM D, YYYY')}</p>
                                                        <p className="text-gray-300">{episode.overview}</p>
                                                        <p className='flex gap-1 items-center'>
                                                            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                                            {episode.vote_average} / 10
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400">Loading episodes...</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default MoviePage;
