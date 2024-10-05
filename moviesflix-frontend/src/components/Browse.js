import React, { useEffect, useState } from 'react'
import Header from './Header'
import { API_OPTIONS } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addNowPlayingMovies } from '../utils/movieSlice'
import useNowPlayingMovies from '../hooks/useNowPlayingMovies'
import MainContainer from './MainContainer'
import SecondaryContainer from './SecondaryContainer'
import usePopularMovies from '../hooks/usePopularMovies'
import useNetflixOrgMovies from '../hooks/useNetflixOrgMovies'
import useTopRatedMovies from '../hooks/useTopRatedMovies'
import useUpcomingMovies from '../hooks/useUpcomingMovies'
import useHorrorMovies from '../hooks/useHorrorMovies'
import GptSearch from './GptSearch'
import Chat from './Chat'

const Browse = () => {
  useNowPlayingMovies();
  useUpcomingMovies();
  useHorrorMovies();

  const showGptSearch = useSelector(store => store.gpt.showGptSearch);
  const showAiSearch = useSelector(store => store.gpt.showAiSearch);

  return (
    <div className={`${!showGptSearch && "bg-black"} overflow-x-hidden`}>
      <Header />
      {/* Conditional Rendering */}
      {showGptSearch && !showAiSearch && <GptSearch />}
      {!showGptSearch && showAiSearch && <Chat />}
      {!showGptSearch && !showAiSearch && (
        <div>
          <MainContainer />
          <SecondaryContainer />
        </div>
      )}
    </div>
  );
};

export default Browse;