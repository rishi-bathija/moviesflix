import React from 'react'
import { useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "./player.css"
import { useSelector } from 'react-redux';


const Player = () => {
    const navigate = useNavigate();
    const trailerVideo = useSelector(store => store.movies?.trailerVideo);
    const movieVideo = useSelector(store => store.movies?.movieVideo);
    const isMovieTrailer = useSelector(store => store.movies?.isMovieTrailer);
    const selectedVideoId = useSelector(store => store.movies?.selectedVideoId);

    const videoId = isMovieTrailer ? movieVideo : selectedVideoId || trailerVideo;

    return (
        <div className='w-screen h-screen relative'>
            <div className="back absolute top-2 left-0 md:top-4 md:left-4 p-8 z-10 text-white cursor-pointer font-bold text-[22px]">
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate(-1)} />
            </div>
            <div className='player-wrapper h-full w-full object-cover'>

                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${videoId}`}
                    playing={true} // Auto play
                    controls={true} // Show video controls
                    muted={false}
                    loop={true}
                    width='100%'
                    height='100%'
                />

            </div>
        </div>
    )
}

export default Player
