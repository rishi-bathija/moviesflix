const SavedSearch = require("../models/SavedSearch");
const User = require("../models/User");
const axios = require("axios")

const fetchThroughProxy = async (url, params = {}) => {
    const CLOUDFLARE_PROXY_URL = process.env.CLOUDFLARE_PROXY_URL || 'https://your-worker-name.your-subdomain.workers.dev';
    const urlObj = new URL(url);
    Object.keys(params).forEach(key => {
        urlObj.searchParams.append(key, params[key]);
    });
    const encodedUrl = encodeURIComponent(urlObj.toString());
    const proxyUrl = `${CLOUDFLARE_PROXY_URL}?url=${encodedUrl}`;

    return axios.get(proxyUrl);
};

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
            const tmdbMoviesResponse = await fetchThroughProxy(
                'https://api.themoviedb.org/3/movie/now_playing',
                {
                    api_key: process.env.REACT_APP_API_KEY,
                    language: 'en-US',
                    page: 1
                }
            );

            // newly released tv shows
            const tmdbTvResponse = await fetchThroughProxy(
                'https://api.themoviedb.org/3/tv/airing_today',
                {
                    api_key: process.env.REACT_APP_API_KEY,
                    language: 'en-US',
                    page: 1
                }
            );

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
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

module.exports.saveAiSearch = async (req, res) => {
    try {
        const { question, userInput, fullQuestion, movieNames, movieResults, customName } = req.body;

        if (!fullQuestion || !movieNames || !movieResults) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        let user = await User.findOne({ firebaseUid: req.user.uid });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const existingSearch = await SavedSearch.findOne({ firebaseUid: req.user.uid, fullQuestion: fullQuestion });

        if (existingSearch) {
            existingSearch.movieNames = movieNames;
            existingSearch.movieResults = movieResults;
            existingSearch.updatedAt = new Date();
            if (customName) {
                existingSearch.customName = customName;
            }
            await existingSearch.save();
            return res.status(200).json({ msg: "Search updated successfully", searchId: existingSearch._id });
        }

        const savedSearch = await SavedSearch.create({
            userId: user._id,
            firebaseUid: req.user.uid,
            question,
            userInput,
            fullQuestion,
            movieNames,
            movieResults,
            customName,
        });

        return res.status(200).json({ msg: "Search saved successfully", searchId: savedSearch._id });

    } catch (error) {
        console.error("Error saving search:", error);
        return res.status(500).json({ msg: "Error saving search" });
    }
}

module.exports.getSavedAiSearches = async (req, res) => {
    try {
        const searches = await SavedSearch.find({
            firebaseUid: req.user.uid
        })
            .sort({ createdAt: -1 });

        if (!searches) {
            return res.status(400).json({ msg: "No saved searches found" });
        }

        return res.status(200).json({ msg: "Saved searches fetched successfully", searches });
    } catch (error) {
        console.error("Error fetching saved searches:", error);
        return res.status(500).json({ msg: "Error fetching saved searches" });
    }
}

module.exports.deleteSavedAiSearch = async (req, res) => {
    try {
        const { searchId } = req.body;

        if (!searchId) {
            return res.status(400).json({ msg: "Search ID is required" });
        }

        // Verify the search belongs to the user
        const search = await SavedSearch.findOne({
            _id: searchId,
            firebaseUid: req.user.uid
        });

        if (!search) {
            return res.status(404).json({ msg: "Search not found" });
        }

        await SavedSearch.deleteOne({ _id: searchId });

        return res.status(200).json({ msg: "Search deleted successfully" });
    } catch (error) {
        console.error("Error deleting saved search:", error);
        return res.status(500).json({ msg: "Error deleting saved search" });
    }
}

module.exports.updateSavedAiSearchName = async (req, res) => {
    try {
        const { searchId, customName } = req.body;
        if (!searchId) {
            return res.status(400).json({ msg: "Search ID is required" });
        }

        const search = await SavedSearch.findOne({
            _id: searchId,
            firebaseUid: req.user.uid
        });

        if (!search) {
            return res.status(404).json({ msg: "Search not found" });
        }

        search.customName = customName;
        search.updatedAt = new Date();
        await search.save();

        return res.status(200).json({ msg: "Search name updated successfully" });
    } catch (error) {
        console.error("Error updating saved search name:", error);
        return res.status(500).json({ msg: "Error updating saved search name" });
    }
}

module.exports.getSavedAiSearchById = async (req, res) => {
    try {
        const { searchId } = req.params;

        const search = await SavedSearch.findOne({
            _id: searchId,
            firebaseUid: req.user.uid
        });

        if (!search) {
            return res.status(404).json({ msg: "Search not found" });
        }

        return res.status(200).json({ msg: "Search fetched successfully", search });
    } catch (error) {
        console.error("Error fetching saved search by ID:", error);
        return res.status(500).json({ msg: "Error fetching saved search by ID" });
    }
}

// Add these methods to UserController.js after the removeFromWatchList method

module.exports.addToLikedMovies = async (req, res) => {
    try {
        const { movieId, data } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (user) {
            const { likedMovies, dislikedMovies } = user;
            const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);

            if (movieAlreadyLiked) {
                return res.status(400).json({ msg: "Movie already added to liked list." });
            }

            // Remove from disliked if it was there
            const dislikedIndex = dislikedMovies.findIndex(({ id }) => id === data.id);
            if (dislikedIndex !== -1) {
                dislikedMovies.splice(dislikedIndex, 1);
            }

            await User.findByIdAndUpdate(user._id, {
                likedMovies: [...user.likedMovies, data],
                dislikedMovies: dislikedMovies,
            }, { new: true });
        } else {
            await User.create({ firebaseUid: req.user.uid, likedMovies: [data] });
        }

        return res.json({ msg: "Movie successfully added to liked list." });
    } catch (error) {
        console.error("Error adding movie to liked list:", error);
        return res.status(500).json({ msg: "Error adding movie to liked list" });
    }
};

module.exports.addToDislikedMovies = async (req, res) => {
    try {
        const { movieId, data } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (user) {
            const { dislikedMovies, likedMovies } = user;
            const movieAlreadyDisliked = dislikedMovies.find(({ id }) => id === data.id);

            if (movieAlreadyDisliked) {
                return res.status(400).json({ msg: "Movie already added to disliked list." });
            }

            // Remove from liked if it was there
            const likedIndex = likedMovies.findIndex(({ id }) => id === data.id);
            if (likedIndex !== -1) {
                likedMovies.splice(likedIndex, 1);
            }

            await User.findByIdAndUpdate(user._id, {
                dislikedMovies: [...user.dislikedMovies, data],
                likedMovies: likedMovies,
            }, { new: true });
        } else {
            await User.create({ firebaseUid: req.user.uid, dislikedMovies: [data] });
        }

        return res.json({ msg: "Movie successfully added to disliked list." });
    } catch (error) {
        console.error("Error adding movie to disliked list:", error);
        return res.status(500).json({ msg: "Error adding movie to disliked list" });
    }
};

module.exports.removeFromLikedMovies = async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (user) {
            const movies = user.likedMovies;
            const movieIndex = movies.findIndex(({ id }) => id === movieId);

            if (movieIndex === -1) {
                return res.status(400).json({ msg: "Movie not found in liked list" });
            }

            movies.splice(movieIndex, 1);
            await User.findByIdAndUpdate(user._id, { likedMovies: movies }, { new: true });

            return res.status(200).json({ msg: "Movie successfully removed from liked list", movies });
        } else {
            return res.status(400).json({ msg: "User not found" });
        }
    } catch (error) {
        console.error("Error removing movie from liked list:", error);
        return res.status(500).json({ msg: "Error removing movie from liked list" });
    }
};

module.exports.removeFromDislikedMovies = async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (user) {
            const movies = user.dislikedMovies;
            const movieIndex = movies.findIndex(({ id }) => id === movieId);

            if (movieIndex === -1) {
                return res.status(400).json({ msg: "Movie not found in disliked list" });
            }

            movies.splice(movieIndex, 1);
            await User.findByIdAndUpdate(user._id, { dislikedMovies: movies }, { new: true });

            return res.status(200).json({ msg: "Movie successfully removed from disliked list", movies });
        } else {
            return res.status(400).json({ msg: "User not found" });
        }
    } catch (error) {
        console.error("Error removing movie from disliked list:", error);
        return res.status(500).json({ msg: "Error removing movie from disliked list" });
    }
};

module.exports.getLikedMovies = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (user) {
            return res.status(200).json({
                msg: 'success',
                movies: user.likedMovies || [],
            });
        } else {
            return res.status(400).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching liked movies:", error);
        return res.status(500).json({ msg: "Error fetching liked movies" });
    }
};

module.exports.getDislikedMovies = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (user) {
            return res.status(200).json({
                msg: 'success',
                movies: user.dislikedMovies || [],
            });
        } else {
            return res.status(400).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching disliked movies:", error);
        return res.status(500).json({ msg: "Error fetching disliked movies" });
    }
};