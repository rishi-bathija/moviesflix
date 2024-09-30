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

const Browse = () => {

  useNowPlayingMovies();
  // usePopularMovies();
  // useNetflixOrgMovies();
  // useTopRatedMovies();
  useUpcomingMovies();
  useHorrorMovies();

  const showGptSearch = useSelector(store => store.gpt.showGptSearch);
  const [mainContainerLoaded, setMainContainerLoaded] = useState(false);

  const handleMainContainerLoad = () => {
    setMainContainerLoaded(true);
  };

  // Reset mainContainerLoaded when the component mounts or updates
  // useEffect(() => {
  //   setMainContainerLoaded(false);
  // }, [showGptSearch]); // Re-run effect whenever showGptSearch changes

  return (
    <div className={`${!showGptSearch && "bg-black"} overflow-x-hidden `}>
      <Header />

      {showGptSearch ? <GptSearch /> :
        <div>
          <MainContainer />
          {<SecondaryContainer />}
        </div>
      }

    </div>
  )
}

export default Browse
