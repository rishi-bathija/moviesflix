import React, { useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import './movieListStyles.css';
import axios from '../utils/axios';
import { API_KEY } from '../utils/constants';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MovieList = ({ title, isLargeRow, fetchUrlMovies, fetchUrlTV, isTrending }) => {
    const [moviesList, setMoviesList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('movie');
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('day');
    const [selectedTrendingCategory, setSelectedTrendingCategory] = useState('movie');
    const [showControls, setShowControls] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const ref = useRef();

    const [sliderPosition, setSliderPosition] = useState(0);
    const containerWidth = ref.current ? ref.current.offsetWidth : 0;
    const movieWidth = 230; // Adjust this value based on your movie card width
    const maxVisibleMovies = Math.floor(containerWidth / movieWidth);
    const maxSliderPosition = Math.max(0, moviesList?.length - 1);

    useEffect(() => {
        async function fetchData() {
            try {
                let currentFetchUrl;
                if (isTrending) {
                    currentFetchUrl = selectedTrendingCategory === 'movie'
                        ? `/trending/movie/${selectedTimePeriod}?api_key=${API_KEY}&language=en-US`
                        : `/trending/tv/${selectedTimePeriod}?api_key=${API_KEY}&language=en-US`;
                } else {
                    currentFetchUrl = selectedCategory === 'movie'
                        ? fetchUrlMovies
                        : fetchUrlTV;
                }

                const request = await axios.get(currentFetchUrl);
                setMoviesList(request.data.results);
                return request;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [selectedCategory, selectedTrendingCategory, selectedTimePeriod, isTrending, fetchUrlMovies, fetchUrlTV]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleTimePeriodChange = (timePeriod) => {
        setSelectedTimePeriod(timePeriod);
    };

    const handleTrendingCategoryChange = (trendingCategory) => {
        setSelectedTrendingCategory(trendingCategory);
    };

    const handleDirection = (direction) => {
        setSliderPosition((prevPosition) => {
            if (direction === "left" && prevPosition > 0) {
                return prevPosition - 1;
            }
            if (direction === "right" && prevPosition < maxSliderPosition) {
                const nextPosition = prevPosition + 1;
                if (nextPosition <= moviesList.length - 1) {
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
            setSliderPosition(0);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='p-4 sm:p-6 my-6 sm:my-8'>
            <div className='flex items-center mb-4 justify-between'>
                <h1 className="text-xl sm:text-2xl text-white w-full">{title}</h1>
                <div className='flex'>
                    {isTrending && (
                        <div className="ml-4 flex justify-center items-center">
                            {/* <label className="text-white">Time Period:</label> */}
                            <select
                                className="ml-2 p-2 rounded bg-red-800 text-white"
                                onChange={(e) => handleTimePeriodChange(e.target.value)}
                                value={selectedTimePeriod}
                            >
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                            </select>
                        </div>
                    )}
                    {isTrending && (
                        <div className="ml-4 flex justify-center items-center">
                            {/* <label className="text-white">Category:</label> */}
                            <select
                                className="ml-2 p-2 rounded bg-red-800 text-white"
                                onChange={(e) => handleTrendingCategoryChange(e.target.value)}
                                value={selectedTrendingCategory}
                            >
                                <option value="movie">Movies</option>
                                <option value="tv">TV Shows</option>
                            </select>
                        </div>
                    )}
                </div>
                {!isTrending && (
                    <div className="ml-4 flex justify-center items-center">
                        <label className="text-white">Category:</label>
                        <select
                            className="ml-2 p-2 rounded bg-red-800 text-white"
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            value={selectedCategory}
                        >
                            <option value="movie">Movies</option>
                            <option value="tv">TV Shows</option>
                        </select>
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-4 relative py-8' onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
                <div className="wrapper relative">
                    {!isMobileView && (
                        <div className={`slider-action left ${!showControls ? "none" : ""} flex justify-center items-center`} onClick={() => handleDirection("left")}>
                            {/* left icons */}
                            <FontAwesomeIcon className="text-white" icon={faArrowCircleLeft} />
                        </div>
                    )}
                    <div
                        className={`flex slider gap-4 transition-transform duration-300 ease-in-out ${isMobileView ? "mobile-slider" : ""
                            }`}
                        ref={ref}
                        style={{
                            transform: isMobileView
                                ? "none"
                                : `translateX(${-sliderPosition * movieWidth}px)`,
                        }}
                    >
                        <div className='flex gap-4'>
                            {moviesList?.map(movie => (
                                <MovieCard key={movie.id} posterPath={isLargeRow ? movie.poster_path : movie.backdrop_path} altText={movie.title} movie={movie} isLargeRow={isLargeRow} selectedCategory={isTrending ? selectedTrendingCategory : selectedCategory} isMobileView={isMobileView} />
                            ))}
                        </div>
                    </div>
                    {!isMobileView && (
                        <div
                            className={`slider-action right ${!showControls ? "none" : ""
                                } flex justify-center items-center`}
                            onClick={() => handleDirection("right")}
                        >
                            <FontAwesomeIcon className="text-white" icon={faArrowCircleRight} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieList;


// import React from 'react'
// import MovieCard from './MovieCard'
// import './loginStyle.css'

// const MovieList = ({ title, movies }) => {
//     console.log("Now playing movies", movies);
//     return (
//         <div className='p-6'>
//             <h1 className="text-2xl font-bold mb-4">{title}</h1>
//             <div className="my-8 flex overflow-x-scroll scroll">
//                 <div className='flex gap-4'>
//                     {movies?.map(movie => <MovieCard key={movie.id} posterPath={movie.poster_path} altText={movie.title} />)}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default MovieList
