import React from 'react';
import './loginStyle.css'; // Ensure this CSS file includes skeleton styles

const SkeletonLoader = () => {
    return (
        <div className="w-screen aspect-video bg-black">
            {/* Skeleton for VideoBackground */}
            <div className="w-screen aspect-video bg-gray-800 animate-pulse" />

            {/* Skeleton for VideoTtile */}
            <div className="absolute top-0 pt-[20%] md:pt-[10%] md:px-16 px-6 bg-gradient-to-r from-black w-screen aspect-video">
                {/* Title skeleton */}
                <div className="h-8 md:h-10 w-3/4 md:w-1/2 bg-gray-700 rounded animate-pulse mb-4" />

                {/* Overview skeleton */}
                <div className="hidden md:block w-5/6 md:w-2/3 h-4 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="hidden md:block w-5/6 md:w-2/3 h-4 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="hidden md:block w-2/3 md:w-1/2 h-4 bg-gray-700 rounded animate-pulse" />

                {/* Buttons skeleton */}
                <div className="flex mt-4">
                    <div className="h-10 w-24 md:w-32 bg-gray-700 rounded animate-pulse mr-4" />
                    <div className="hidden md:block h-10 w-32 bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;