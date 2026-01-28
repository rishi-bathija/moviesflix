import React from 'react'
import MovieList from './MovieList'
import { useSelector } from 'react-redux'
import './loginStyle.css'
import requests from '../utils/requests'
import MovieListRedux from './MovieListRedux'
import MovieListSkeleton from './MovieListSkeleton'

const SecondaryContainer = () => {
  const movies = useSelector(store => store.movies);

  if (!movies) {
    return <div className='bg-black'>Loading...</div>
  }

  return (
    <>
      <div className='bg-black'>
        <div className='-mt-8 md:-mt-36 px-3 md:px-6 relative z-20 h-full'>
          {/* {movies.netflixOrgMovies ? ( */}
            <MovieListRedux title={"Netflix Originals"} movies={movies.netflixOrgMovies || []} isLargeRow category />
          {/* ) : (
            <MovieListSkeleton title={"Netflix Originals"} isLargeRow />
          )} */}

          {movies.nowPlayingMovies ? (
            <MovieListRedux title={"Now Playing"} movies={movies.nowPlayingMovies} isLargeRow />
          ) : (
            <MovieListSkeleton title={"Now Playing"} isLargeRow />
          )}

          {/* {movies.popularMovies ? ( */}
            <MovieListRedux title={"Popular"} movies={movies.popularMovies || []} category />
          {/* ) : (
            <MovieListSkeleton title={"Popular"} />
          )} */}

          {/* {movies.topRatedMovies ? ( */}
            <MovieListRedux title={"Top Rated"} movies={movies.topRatedMovies || []} category />
          {/* ) : (
            <MovieListSkeleton title={"Top Rated"} />
          )} */}

          {movies.upcomingMovies ? (
            <MovieListRedux title={"Upcoming"} movies={movies.upcomingMovies} />
          ) : (
            <MovieListSkeleton title={"Upcoming"} />
          )}

          {movies.horrorMovies ? (
            <MovieListRedux title={"Horror"} movies={movies.horrorMovies} />
          ) : (
            <MovieListSkeleton title={"Horror"} />
          )}

          <MovieList title={"Trending"} isTrending={true} />
          <MovieList title={"Action"} fetchUrlMovies={requests.fetchAction} fetchUrlTV={requests.fetchActionTV} />
          <MovieList title={"Comedy"} fetchUrlMovies={requests.fetchComedy} fetchUrlTV={requests.fetchComedyTV} />
        </div>
      </div>
    </>
  )
}

export default SecondaryContainer
