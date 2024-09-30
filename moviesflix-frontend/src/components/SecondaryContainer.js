import React from 'react'
import MovieList from './MovieList'
import { useSelector } from 'react-redux'
import './loginStyle.css'
import requests from '../utils/requests'
import MovieListRedux from './MovieListRedux'


const SecondaryContainer = () => {
  const movies = useSelector(store => store.movies);
  return (
    <>
      <div className='bg-black'>
        <div className='-mt-8 md:-mt-36 px-3 md:px-6 relative z-20 h-full'>
          <MovieListRedux title={"Netflix Originals"} movies={movies.netflixOrgMovies} isLargeRow category />
          <MovieListRedux title={"Now Playing"} movies={movies.nowPlayingMovies} isLargeRow />
          <MovieListRedux title={"Popular"} movies={movies.popularMovies} category />
          <MovieListRedux title={"Top Rated"} movies={movies.topRatedMovies} category />
          <MovieListRedux title={"Upcoming"} movies={movies.upcomingMovies} />
          <MovieListRedux title={"Horror"} movies={movies.horrorMovies} />

          <MovieList title={"Trending"} isTrending={true} />
          <MovieList title={"Action"} fetchUrlMovies={requests.fetchAction} fetchUrlTV={requests.fetchActionTV} />
          <MovieList title={"Comedy"} fetchUrlMovies={requests.fetchComedy} fetchUrlTV={requests.fetchComedyTV} />
        </div>
      </div>
    </>
  )
}

export default SecondaryContainer
