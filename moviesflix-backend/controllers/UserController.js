const User = require("../models/User");

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
            return res.status(200).json({
                msg: 'success',
                movies: user.watchlistMovies,
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