import React, { useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';

const VideoPlayer = ({ trailerVideo, onClose }) => {
    useEffect(() => {
        // You can add any cleanup logic or event listeners here
        return () => {
            // Cleanup logic if needed
        };
    }, []);

    return (
        <div className="w-screen aspect-video">
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailerVideo}`}
                playing={true} // Auto play
                controls={false} // Show video controls
                muted={true}
                loop={true}
                width='100%'
                height='100%'
            />
            {/* Add a close button or any other UI elements if needed */}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default VideoPlayer;
