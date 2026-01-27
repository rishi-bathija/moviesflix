import React from 'react';
import MovieListSkeleton from './MovieListSkeleton';
import './loginStyle.css';

const SecondaryContainerSkeleton = () => {
    return (
        <div className="bg-black">
            <div className="-mt-8 md:-mt-36 px-3 md:px-6 relative z-20 h-full">
                <MovieListSkeleton title="Netflix Originals" isLargeRow />
                <MovieListSkeleton title="Now Playing" isLargeRow />
                <MovieListSkeleton title="Popular" />
                <MovieListSkeleton title="Top Rated" />
                <MovieListSkeleton title="Upcoming" />
                <MovieListSkeleton title="Horror" />
                <MovieListSkeleton title="Trending" />
                <MovieListSkeleton title="Action" />
                <MovieListSkeleton title="Comedy" />
            </div>
        </div>
    );
};

export default SecondaryContainerSkeleton;