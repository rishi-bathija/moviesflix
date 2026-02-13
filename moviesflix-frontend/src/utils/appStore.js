import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from './movieSlice';
import gptReducer from "./searchSlice";
import configReducer from "./configSlice";
import likeDislikeReducer from "./likeDislikeSlice";

const appStore = configureStore({
    reducer: {
        user: userReducer,
        movies: moviesReducer,
        gpt: gptReducer,
        config: configReducer,
        likeDislike: likeDislikeReducer,
    }
});

export default appStore