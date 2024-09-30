import React, { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_KEY, IMG_CDN } from '../utils/constants';
import noposter from './no-poster.png';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import language from '../utils/langConst';
import Spinner from './Spinner'; // Import the Spinner component

const GptSearch = memo(() => {
    const langVal = useSelector((store) => store.config.lang);
    const searchText = useRef(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState('movie');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    const fetchData = async (resetPage = false) => {
        const query = searchText.current.value;
        if (!query) return;

        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/${searchType}?query=${query}&api_key=${API_KEY}&page=${resetPage ? 1 : page}`
            );

            if (resetPage) {
                setSearchResults(response.data.results);
                setPage(2);
            } else {
                setSearchResults(prevResults => [...prevResults, ...response.data.results]);
                setPage(prevPage => prevPage + 1);
            }

            setHasMore(response.data.page < response.data.total_pages);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchData(true);
    };

    useEffect(() => {
        fetchData(true);
    }, [searchType]);

    return (
        <>
            <div className='fixed -z-10'>
                <img src="https://assets.nflxext.com/ffe/siteui/vlv3/563192ea-ac0e-4906-a865-ba9899ffafad/6b2842d1-2339-4f08-84f6-148e9fcbe01b/IN-en-20231218-popsignuptwoweeks-perspective_alpha_website_large.jpg" alt="background" className='h-screen md:h-full object-cover' />
            </div>
            <div>
                <div className="searchbar pt-[35%] md:pt-[10%] flex justify-center flex-row">
                    <form className="bg-black w-full md:w-3/4 grid grid-cols-1 md:grid-cols-12 mx-[10px] m-0" onSubmit={(e) => e.preventDefault()}>
                        <input type="text" className='p-4 m-4 md:col-span-8 col-span-6' placeholder={language[langVal].gptSearchPlaceholder} ref={searchText} />
                        <select
                            className="m-4 p-2 bg-red-800 text-white rounded-lg md:col-span-2 col-span-3"
                            onChange={(e) => setSearchType(e.target.value)}
                            value={searchType}
                        >
                            <option value="movie">Movies</option>
                            <option value="tv">TV Shows</option>
                        </select>
                        <button className="m-4 py-2 px-4 bg-red-600 hover:bg-red-800 text-white rounded-lg md:col-span-2 col-span-3" onClick={handleSearch}>
                            {language[langVal].search}
                        </button>
                    </form>
                </div>
                {searchText.current?.value && (
                    <InfiniteScroll
                        dataLength={searchResults.length}
                        next={() => fetchData(false)}
                        hasMore={hasMore}
                        loader={<Spinner />} // Use Spinner component here
                        endMessage={<p className='text-white text-2xl text-center font-bold'>No more results</p>}
                    >
                        <div className="movie-suggestions p-4 m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {searchResults.map((movie) => (
                                <div key={movie.id} className="movie-card p-4 rounded-lg text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 bg-black" onClick={() => navigate(`/${movie.id}?type=${searchType}`)}>
                                    {movie.poster_path ? <img src={IMG_CDN + movie.poster_path} alt={movie.title} className="rounded-lg mb-2" /> : <img src={noposter} alt={movie.title} />}
                                    <p className="text-lg font-bold">{movie.title ? movie.title : movie.name}</p>
                                    <p className="text-gray-400">{movie.release_date ? movie.release_date : movie.first_air_date}</p>
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </>
    );
});

export default GptSearch;
