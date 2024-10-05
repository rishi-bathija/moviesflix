const User = require("../models/User");
const axios = require("axios")
module.exports.addToWatchListMovies = async (req, res) => {
    try {
        const { movieId, data } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (user) {
            // console.log("user", user);
            const { watchlistMovies } = user;
            const movieAlreadyAdded = watchlistMovies.find(({ id }) => id === data.id);
            if (!movieAlreadyAdded) {
                await User.findByIdAndUpdate(user._id, {
                    watchlistMovies: [...user.watchlistMovies, data],
                }, { new: true }
                )
            }
            else return res.json({ msg: "Movie already added to the watchlist." });
        }
        else await User.create({ firebaseUid: req.user.uid, watchlistMovies: [data] });
        return res.json({ msg: "Movie successfully added to watchlist." });
    } catch (error) {
        return res.json({ msg: "Error adding movie to the liked list" });
    }
}

module.exports.getWatchListMovies = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (user) {
            // console.log('User found:', user);  // Log the user object to see if it's correctly fetched
            // console.log('User watchlist:', user.watchlistMovies);  // Log the watchlist

            return res.status(200).json({
                msg: 'success',
                movies: user.watchlistMovies || [], // Return an empty array if no movies are found
            })
        }
        else {
            return res.status(400).json({ msg: 'User with the given id not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error fetching movies." });
    }
}

module.exports.removeFromWatchList = async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (user) {
            const movies = user.watchlistMovies;
            const movieIndex = movies.findIndex(({ id }) => id === movieId);
            if (movieIndex === -1) {
                return res.status(400).json({
                    msg: "Movie not found"
                });
            }
            movies.splice(movieIndex, 1);
            await User.findByIdAndUpdate(
                user._id,
                { watchlistMovies: movies },
                { new: true }
            );

            return res.status(200).json({
                msg: "Movie successfully removed", movies
            });
        }
        else return res.status(400).json({ msg: "User with given email not found." });
    } catch (error) {
        return res.status(500).json({ msg: "Error removing movie to the watchlist" });
    }
}

module.exports.generateChat = async (req, res) => {
    const question = req.body.question.toLowerCase();
    // const country = req.body.country || 'US';

    try {
        if (question.includes("newly release")) {
            // newly released movies
            const tmdbMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/now_playing`, {
                params: {
                    api_key: process.env.REACT_APP_API_KEY,
                    language: 'en-US',
                    // region: country,
                    page: 1
                }
            });

            // newly released tv shows
            const tmdbTvResponse = await axios.get(`https://api.themoviedb.org/3/tv/airing_today`, {
                params: {
                    api_key: process.env.REACT_APP_API_KEY,
                    language: 'en-US',
                    // region: country,
                    page: 1
                }
            });

            const movies = tmdbMoviesResponse.data.results.slice(0, 5).map(movie => movie.title);
            const tvShows = tmdbTvResponse.data.results.slice(0, 5).map(tvShow => tvShow.name);

            // combine the results
            res.json({
                movies: movies.join(', '),
                tvShows: tvShows.join(', '),
            });
        }
        else {


            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    "contents": [
                        {
                            "parts": [{
                                "text": `Act as a movie recommendation system and suggest 10 movies and TV shows based on the following question. Only provide the names of the movies and TV shows, separated by commas. The question is: ${question}`
                            }]
                        }
                    ]
                }
            );
            res.json(response.data);
        }
    } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({ message: "Error fetching movie recommendations" });
    }
}