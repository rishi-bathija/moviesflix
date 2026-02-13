import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';

const EntertainmentNews = () => {
  const [articles, setArticles] = useState([]);
  const [country, setCountry] = useState('in');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [nextPage, setNextPage] = useState(null); // ⬅️ Store nextPage token
  const [currentPage, setCurrentPage] = useState(1); // ⬅️ For NewsAPI pagination

  const API_BASE_URL =
    process.env.REACT_APP_CLIENT_URL || 'http://localhost:4000';

  const fetchNews = async (selectedCountry = country, pageNum = 1, nextPageToken = null, append = false) => {
    try {
      if (!append) {
        setIsLoading(true);
        setCurrentPage(1);
        setNextPage(null);
      }
      setError(null);

      // Build URL with appropriate pagination parameter
      let url = `${API_BASE_URL}/api/news/entertainment?country=${selectedCountry}&pageSize=20`;
      
      if (nextPageToken) {
        // Use nextPage token for newsdata.io
        url += `&nextPage=${nextPageToken}`;
      } else if (pageNum > 1) {
        // Use page number for newsapi.org
        url += `&page=${pageNum}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();

      if (append) {
        setArticles(prev => [...prev, ...(data.articles || [])]);
      } else {
        setArticles(data.articles || []);
      }

      setTotalResults(data.totalResults || data.articles?.length || 0);
      setHasMore(data.hasMore !== false);
      setNextPage(data.nextPage || null); // ⬅️ Store nextPage token
      setCurrentPage(pageNum);
      
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch entertainment news. Please try again later.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews('in', 1, null, false);
    // eslint-disable-next-line
  }, []);

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    setCurrentPage(1);
    setNextPage(null);
    setHasMore(true);
    fetchNews(newCountry, 1, null, false);
  };

  const loadMoreNews = () => {
    if (nextPage) {
      // Use nextPage token (newsdata.io)
      fetchNews(country, currentPage, nextPage, true);
    } else {
      // Use page number (newsapi.org)
      const nextPageNum = currentPage + 1;
      fetchNews(country, nextPageNum, null, true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">
          Entertainment News
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">Region:</span>
          <select
            value={country}
            onChange={handleCountryChange}
            className="p-2 bg-red-800 text-white rounded cursor-pointer"
          >
            <option value="in">India</option>
            <option value="us">USA</option>
            <option value="gb">UK</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
          </select>
        </div>
      </div>

      {totalResults > 0 && (
        <p className="text-gray-400 text-sm mb-4">
          Showing {articles.length} of {totalResults} articles
        </p>
      )}

      {!articles.length && !isLoading ? (
        <p className="text-gray-400">
          No news available right now. Try another region.
        </p>
      ) : (
        <InfiniteScroll
          dataLength={articles.length}
          next={loadMoreNews}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          }
          endMessage={
            <p className="text-center text-gray-400 py-8">
              {articles.length > 0 ? 'No more articles to load' : 'No articles found'}
            </p>
          }
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col group"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={
                      article.urlToImage ||
                      'https://via.placeholder.com/400x200?text=No+Image'
                    }
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-2">
                    <FontAwesomeIcon
                      icon={faExternalLinkAlt}
                      className="text-white text-sm"
                    />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-red-500 transition">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                      {article.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    {article.sourceName && (
                      <span className="text-gray-600">{article.sourceName}</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default EntertainmentNews;