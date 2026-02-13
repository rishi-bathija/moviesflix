const axios = require('axios');

module.exports.getEntertainmentNews = async (req, res) => {
  try {
    let apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ msg: 'NEWS_API_KEY not configured' });
    }

    const { country = 'in', pageSize = 20, page = 1, nextPage } = req.query; // ⬅️ Add nextPage for newsdata.io

    let articles = [];
    let totalResults = 0;
    let hasMore = false;
    let nextPageToken = null;

    // 1️⃣ Try newsapi.org first (works well for US)
    try {
      const topHeadlinesParams = {
        category: 'entertainment',
        country,
        pageSize: Math.min(pageSize, 100), // NewsAPI max is 100
        page,
        apiKey
      };

      const topHeadlinesUrl = new URL('https://newsapi.org/v2/top-headlines');
      Object.keys(topHeadlinesParams).forEach(key => {
        topHeadlinesUrl.searchParams.append(key, topHeadlinesParams[key]);
      });

      console.log('Fetching newsapi.org:', topHeadlinesUrl.toString());
      const response = await axios.get(topHeadlinesUrl.toString());

      articles = response.data.articles || [];
      totalResults = response.data.totalResults || 0;
      hasMore = articles.length >= pageSize && (page * pageSize) < totalResults;
      
      console.log(`newsapi.org returned ${articles.length} articles (total: ${totalResults})`);
    } catch (newsApiError) {
      console.log('newsapi.org failed, trying newsdata.io...', newsApiError.message);
    }

    // 2️⃣ FALLBACK to newsdata.io if no articles found
    if (articles.length === 0) {
      apiKey = process.env.NEWSDATA_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ msg: 'NEWSDATA_API_KEY not configured' });
      }

      const newsDataParams = {
        category: 'entertainment',
        language: 'en',
        country,
        apikey: apiKey // ⬅️ Note: lowercase 'apikey' for newsdata.io
      };

      // ⬅️ Add nextPage token if provided (for pagination)
      if (nextPage) {
        newsDataParams.page = nextPage;
      }

      const newsDataUrl = new URL('https://newsdata.io/api/1/latest');
      Object.keys(newsDataParams).forEach(key => {
        newsDataUrl.searchParams.append(key, newsDataParams[key]);
      });

      console.log('Fetching newsdata.io:', newsDataUrl.toString());
      
      try {
        const response = await axios.get(newsDataUrl.toString());
        
        articles = response.data.results || [];
        totalResults = response.data.totalResults || 0;
        nextPageToken = response.data.nextPage || null; // ⬅️ Get nextPage token
        hasMore = !!nextPageToken; // ⬅️ hasMore is true if nextPage exists
        
        console.log(`newsdata.io returned ${articles.length} articles (total: ${totalResults}, nextPage: ${nextPageToken ? 'yes' : 'no'})`);
      } catch (newsDataError) {
        console.error('newsdata.io error:', newsDataError.response?.data || newsDataError.message);
        throw newsDataError;
      }
    }

    // 3️⃣ Map data based on which API was used
    const formattedArticles = articles.map((a, index) => ({
      id: a.article_id || `${a.source?.id || 'src'}-${index}-${Date.now()}`,
      title: a.title,
      description: a.description || a.content,
      url: a.link || a.url,
      urlToImage: a.image_url || a.urlToImage,
      publishedAt: a.pubDate || a.publishedAt,
      sourceName: a.source_name || a.source?.name,
      author: a.creator?.[0] || a.author
    }));

    return res.status(200).json({
      msg: 'success',
      articles: formattedArticles,
      totalResults: totalResults || formattedArticles.length,
      hasMore: hasMore,
      nextPage: nextPageToken // ⬅️ Return nextPage token for newsdata.io
    });

  } catch (error) {
    console.error(
      'Error fetching entertainment news:',
      error.response?.data || error.message
    );

    return res.status(500).json({
      msg: 'Error fetching entertainment news',
      error: error.response?.data || error.message
    });
  }
};