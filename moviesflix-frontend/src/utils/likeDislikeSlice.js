import { createSlice } from "@reduxjs/toolkit"

const likeDislikeSlice = createSlice({
    name: 'likeDislike',
    initialState: {
        likedMovies: [],
        dislikedMovies: [],
        loading: false,
    },
    reducers: {
        setLikedMovies: (state, action) => {
            state.likedMovies = action.payload;
        },
        setDislikedMovies: (state, action) => {
            state.dislikedMovies = action.payload;
        },
        addLikedMovie: (state, action) => {
            if (!state.likedMovies.some(m => m.id === action.payload.id)) {
                state.likedMovies.push(action.payload);
            }
            state.dislikedMovies = state.dislikedMovies.filter(m => m.id !== action.payload.id);
        },
        addDislikedMovie: (state, action) => {
            if (!state.dislikedMovies.some(m => m.id === action.payload.id)) {
                state.dislikedMovies.push(action.payload);
            }
            state.likedMovies = state.likedMovies.filter(m => m.id !== action.payload.id);
        },
        removeLikedMovie: (state, action) => {
            state.likedMovies = state.likedMovies.filter(m => m.id !== action.payload);
        },
        removeDislikedMovie: (state, action) => {
            state.dislikedMovies = state.dislikedMovies.filter(m => m.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setLikedMovies, setDislikedMovies, addLikedMovie, addDislikedMovie, removeLikedMovie, removeDislikedMovie, setLoading } = likeDislikeSlice.actions;
export default likeDislikeSlice.reducer;