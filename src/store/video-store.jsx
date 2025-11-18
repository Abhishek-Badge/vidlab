// src/store/video-store.jsx
import { configureStore } from "@reduxjs/toolkit";
import videosReducer from "../slicers/video-slicer";

export default configureStore({
    reducer: {
        videos: videosReducer, // <-- state.videos.*
    },
    devTools: process.env.NODE_ENV !== "production",
});
