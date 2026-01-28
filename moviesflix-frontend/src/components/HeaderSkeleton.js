import React from 'react';
import './loginStyle.css'; // Ensure this CSS file includes skeleton styles

const HeaderSkeleton = () => {
    return (
        <div className="w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-row justify-between items-center">
            {/* Skeleton for Logo */}
            <div className="w-40 md:w-48 h-12 bg-gray-700 rounded animate-pulse -ml-4 md:ml-0 my-2" />

            {/* Skeleton for User Section */}
            <div className="flex items-center gap-4">
                {/* Skeleton for Search Icon */}
                <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />

                {/* Skeleton for User Name (hidden on mobile) */}
                <div className="hidden md:block w-24 h-6 bg-gray-700 rounded animate-pulse" />

                {/* Skeleton for User Profile Image */}
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full animate-pulse" />

                {/* Skeleton for Dropdown Icon */}
                <div className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
            </div>
        </div>
    );
};

export default HeaderSkeleton;