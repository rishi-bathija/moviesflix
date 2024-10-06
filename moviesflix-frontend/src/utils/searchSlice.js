import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
    name: 'gpt',
    initialState: {
        showGptSearch: false,
        movieNames: null,
        movieResults: null,
        showAiSearch: false,
        answer: null,
        isLoading: false,
        results: [],
        searchType: 'movie',
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
        },
        setGptMovieResult: (state, action) => {
            state.answer = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload.isLoading;
        },
        setSearchResults: (state, action) => {
            state.results = action.payload;
        },
        setSearchType: (state, action) => {
            state.searchType = action.payload;
        },
    }
})

export const { toggleGptSearch, addGptMovieResult, toggleAiSearch, clearGptMovieResult, setGptMovieResult, setIsLoading, setSearchResults, setSearchType } = gptSlice.actions;
export default gptSlice.reducer;