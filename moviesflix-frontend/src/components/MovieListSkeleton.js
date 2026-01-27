import React from 'react';
import './loginStyle.css'; // Ensure this CSS file includes skeleton styles

const MovieListSkeleton = ({ title, isLargeRow }) => {
    // Calculate number of skeleton cards based on screen width
    const [cardCount, setCardCount] = React.useState(7);

    React.useEffect(() => {
        const updateCardCount = () => {
            const width = window.innerWidth;
            if (width < 640) { // mobile
                setCardCount(3);
            } else if (width < 1024) { // tablet
                setCardCount(4);
            } else { // desktop
                setCardCount(7);
            }
        };

        updateCardCount();
        window.addEventListener('resize', updateCardCount);
        return () => window.removeEventListener('resize', updateCardCount);
    }, []);

    return (
        <div className="px-2 sm:p-6 my-4 sm:my-8">
            {/* Skeleton for Title */}
            <div className="flex items-center mb-4 justify-between">
                <div className="h-5 sm:h-8 w-32 sm:w-1/3 bg-gray-700 rounded animate-pulse" />
                {/* Skeleton for Category/Time Period Dropdown */}
                <div className="flex gap-2 sm:gap-4">
                    <div className="h-6 sm:h-8 w-16 sm:w-32 bg-gray-700 rounded animate-pulse" />
                </div>
            </div>

            {/* Skeleton for Movie Cards */}
            <div className="relative py-4 sm:py-8 overflow-hidden">
                <div className="flex overflow-x-auto gap-2 sm:gap-4 hide-scrollbar">
                    {[...Array(cardCount)].map((_, index) => (
                        <div
                            key={index}
                            className={`flex-none ${
                                isLargeRow 
                                    ? 'w-28 h-40 sm:w-40 sm:h-60 md:w-48 md:h-72' 
                                    : 'w-36 h-20 sm:w-48 sm:h-28 md:w-64 md:h-36'
                            } bg-gray-700 rounded animate-pulse`}
                            style={{
                                animationDelay: `${index * 150}ms`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Add custom CSS for hiding scrollbar */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes customPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
                .animate-pulse {
                    animation: customPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default MovieListSkeleton;