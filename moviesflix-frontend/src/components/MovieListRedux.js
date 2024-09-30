import React, { useRef, useState, useEffect, memo } from 'react';
import MovieCard from './MovieCard';
import './loginStyle.css';
import useNetflixOrgMovies from '../hooks/useNetflixOrgMovies';
import useHorrorMovies from '../hooks/useHorrorMovies';
import usePopularMovies from '../hooks/usePopularMovies';
import useTopRatedMovies from '../hooks/useTopRatedMovies';
import useNowPlayingMovies from '../hooks/useNowPlayingMovies';
import ExpandedMovieCard from './ExpandedMovieCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

const MovieListRedux = memo(({ title, movies, isLargeRow, category, type, userSelected, isAdded, onDelete }) => {
    // console.log("type", type);
    const [categories, setCategories] = useState({
        'Netflix Originals': 'movie',
        'Popular': 'movie',
        'Top Rated': 'movie',
        'Now Playing': 'movie',
    });

    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [showControls, setShowControls] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const ref = useRef();
    const [sliderPosition, setSliderPosition] = useState(0);
    const containerWidth = ref.current ? ref.current.offsetWidth : 0;
    const movieWidth = 230; // Adjust this value based on your movie card width
    const maxVisibleMovies = Math.floor(containerWidth / movieWidth);
    const maxSliderPosition = Math.max(0, movies?.length - 1);

    const handleCategoryChange = (category, title) => {
        setCategories(prevCategories => ({
            ...prevCategories,
            [title]: category,
        }));
    };

    useNetflixOrgMovies(categories['Netflix Originals']);
    usePopularMovies(categories['Popular']);
    useTopRatedMovies(categories['Top Rated']);
    useNowPlayingMovies(categories['Now Playing']);

    const handleDirection = (direction) => {
        setSliderPosition((prevPosition) => {
            if (direction === "left" && prevPosition > 0) {
                return prevPosition - 1;
            }
            if (direction === "right" && prevPosition < maxSliderPosition) {
                const nextPosition = prevPosition + 1;
                if (nextPosition <= movies.length - 1) {
                    return nextPosition;
                } else {
                    return prevPosition; // Prevent sliding beyond the end
                }
            }
            return prevPosition;
        });
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
            setSliderPosition(0);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='p-6 my-8'>
            <div className='flex items-center mb-4 justify-between'>
                <h1 className='text-2xl text-white'>{title}</h1>
                {category && (
                    <div className='ml-4'>
                        <label className='text-white'>Category:</label>
                        <select
                            className='ml-2 p-2 bg-red-800 rounded text-white'
                            value={categories[title]}
                            onChange={(e) => handleCategoryChange(e.target.value, title)}
                        >
                            <option value='movie'>Movies</option>
                            <option value='tv'>TV Shows</option>
                        </select>
                    </div>
                )}
            </div>

            <div className='flex flex-col gap-4 relative py-8' onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
                <div className="wrapper" style={{ position: 'relative' }}>
                    {!isMobileView && (
                        <div className={`slider-action left ${!showControls ? "none" : ""} flex justify-center items-center`} onClick={() => handleDirection("left")}>
                            <FontAwesomeIcon className="text-white" icon={faArrowCircleLeft} />
                        </div>
                    )}
                    <div className={`flex slider gap-4 transition-transform duration-300 ease-in-out ${isMobileView ? 'mobile-slider' : ''}`} ref={ref} style={{ transform: isMobileView ? 'none' : `translateX(${-sliderPosition * movieWidth}px)` }}>
                        {movies
                            ?.map((movie, index) => (
                                <div key={movie.id} className="movie-wrapper" onMouseEnter={() => setHoveredMovie(movie)} onMouseLeave={() => setHoveredMovie(null)}>
                                    {!isMobileView && hoveredMovie === movie && isLargeRow ? (
                                        <ExpandedMovieCard movie={movie} backdropPath={movie.backdrop_path} selectedCategory={type ? type : categories[title]} isMobileView={isMobileView} />
                                    ) : (
                                        <MovieCard
                                            posterPath={isLargeRow ? movie.poster_path : movie.backdrop_path}
                                            altText={movie.title}
                                            movie={movie}
                                            selectedCategory={userSelected ? userSelected : type ? type : (!category ? 'movie' : categories[title])}
                                            isMobileView={isMobileView}
                                            isAdded={isAdded}
                                            onDelete={onDelete}
                                        />
                                    )}
                                </div>
                            ))}
                    </div>
                    {!isMobileView && (
                        <div className={`slider-action right ${!showControls ? "none" : ""} flex justify-center items-center`} onClick={() => handleDirection("right")}>
                            <FontAwesomeIcon className="text-white" icon={faArrowCircleRight} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default MovieListRedux;
