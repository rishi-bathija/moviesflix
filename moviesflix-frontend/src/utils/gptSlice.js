import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
    name: 'gpt',
    initialState: {
        showGptSearch: false,
        movieNames: null,
        movieResults: null,
        showAiSearch: false,
    },
    reducers: {
        toggleGptSearch: (state, action) => {
            state.showGptSearch = !state.showGptSearch;
        },
        addGptMovieResult: (state, action) => {
            const { movieNames, gptResults } = action.payload;
            state.movieNames = movieNames;
            state.movieResults = gptResults;
        },
        toggleAiSearch: (state, action) => {
            state.showAiSearch = !state.showAiSearch;
        },
        clearGptMovieResult: (state) => {
            state.movieNames = null;
            state.movieResults = null;
        }
    }
})

export const { toggleGptSearch, addGptMovieResult, toggleAiSearch, clearGptMovieResult } = gptSlice.actions;
export default gptSlice.reducer;