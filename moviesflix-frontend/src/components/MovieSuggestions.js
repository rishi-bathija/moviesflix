import React from 'react'
import { useSelector } from 'react-redux'
import MovieListRedux from './MovieListRedux';

const MovieSuggestions = () => {
    const { movieNames, movieResults } = useSelector((state) => state.gpt);
    if (!movieNames || !movieResults) return null;

    // console.log('chatmovies', movieResults);

    return (
        <div className="w-full bg-black text-white md:px-4  lg:px-16 md:py-6 p-0">
            <div className="w-full">
                {movieNames.map((movieName, index) => (
                    <MovieListRedux key={index} title={movieName} movies={movieResults[index]} />
                ))}
            </div>
        </div>
    );

}

export default MovieSuggestions
