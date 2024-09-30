import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
    name: 'movies',
    initialState: {
        nowPlayingMovies: null,
        trailerVideo: null,
        popularMovies: null, // Add other properties here
        netflixOrgMovies: null,
        topRatedMovies: null,
        upcomingMovies: null,
        horrorMovies: null,
        genres: null,
        casts: [],
        movieVideo: null,
        isMovieTrailer: false,
        selectedVideoId: null,
        watchlist: [],
    },
    reducers: {
        addNowPlayingMovies: (state, action) => {
            state.nowPlayingMovies = action.payload;
        },
        addTrailerVideo: (state, action) => {
            state.trailerVideo = action.payload;
        },
        addMovieVideo: (state, action) => {
            state.movieVideo = action.payload;
        },
        addPopularMovies: (state, action) => {
            state.popularMovies = action.payload;
        },
        addNetflixOrgMovies: (state, action) => {
            state.netflixOrgMovies = action.payload;
        },
        addTopRatedMovies: (state, action) => {
            state.topRatedMovies = action.payload;
        },
        addUpcomingMovies: (state, action) => {
            state.upcomingMovies = action.payload;
        },
        addHorrorMovies: (state, action) => {
            state.horrorMovies = action.payload;
        },
        getGenres: (state, action) => {
            state.genres = action.payload;
        },
        addCast: (state, action) => {
            const { cast, selectedCategory, mediaId } = action.payload;
            const existingMediaIndex = state.casts.findIndex(entry => entry.selectedCategory === selectedCategory && entry.mediaId === mediaId);

            // If the media entry exists, update the cast data; otherwise, add a new entry
            if (existingMediaIndex !== -1) {
                state.casts[existingMediaIndex].cast = cast;
            } else {
                state.casts.push({ selectedCategory, mediaId, cast });
            }
        },
        setIsMovieTrailer: (state, action) => {
            state.isMovieTrailer = action.payload;
        },
        setSelectedVideoId: (state, action) => {
            state.selectedVideoId = action.payload;
        },
        setWatchlist: (state, action) => {
            state.watchlist = action.payload; // Set the entire watchlist
        },
        addToWatchlist: (state, action) => {
            state.watchlist.push(action.payload); // Add a movie to the watchlist
        },
        removeFromWatchlist: (state, action) => {
            state.watchlist = state.watchlist.filter(movie => movie.id !== action.payload); // Remove a movie from the watchlist
        }
    }
})

export const { addNowPlayingMovies, addTrailerVideo, addMovieVideo, addPopularMovies, addNetflixOrgMovies, addTopRatedMovies, addUpcomingMovies, addHorrorMovies, getGenres, addCast, setIsMovieTrailer, setSelectedVideoId, setWatchlist, addToWatchlist, removeFromWatchlist } = movieSlice.actions;
export default movieSlice.reducer;