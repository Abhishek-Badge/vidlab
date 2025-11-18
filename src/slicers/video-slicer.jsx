// src/slicers/video-slicer.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],          // videos from /get-videos
    watchLater: [],     // saved videos
    userReactions: {},  // { [VideoId]: "like" | "dislike" }
    likedVideos: [],    // store liked videos here
};

const idOf = (v) => v?.VideoId ?? v?.id ?? v?._id;

const videoSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.items = Array.isArray(action.payload) ? action.payload : [];
        },

        addToWatchLater: (state, action) => {
            const v = action.payload;
            const id = idOf(v);
            if (!state.watchLater.some(x => idOf(x) === id)) {
                state.watchLater.push(v);
            }
        },
        removeFromWatchLater: (state, action) => {
            const id = action.payload;
            state.watchLater = state.watchLater.filter(x => idOf(x) !== id);
        },

        // === LIKE toggle with switching and no negatives ===
        toggleLike: (state, action) => {
            const id = action.payload; // VideoId
            const vid = state.items.find(v => idOf(v) === id);
            if (!vid) return;

            const current = state.userReactions[id]; // "like" | "dislike" | undefined
            vid.Likes = Number(vid.Likes ?? 0);
            vid.Dislikes = Number(vid.Dislikes ?? 0);

            if (current === "like") {
                // undo like
                vid.Likes = Math.max(vid.Likes - 1, 0);
                delete state.userReactions[id];
                // also remove from likedVideos
                state.likedVideos = state.likedVideos.filter(v => idOf(v) !== id);
            } else {
                // add like
                vid.Likes += 1;
                if (current === "dislike") {
                    vid.Dislikes = Math.max(vid.Dislikes - 1, 0);
                }
                state.userReactions[id] = "like";

                // add to likedVideos (if not already)
                if (!state.likedVideos.some(v => idOf(v) === id)) {
                    state.likedVideos.push(vid);
                }
            }
        },

        // === DISLIKE toggle with switching and no negatives ===
        toggleDislike: (state, action) => {
            const id = action.payload; // VideoId
            const vid = state.items.find(v => idOf(v) === id);
            if (!vid) return;

            const current = state.userReactions[id];
            vid.Likes = Number(vid.Likes ?? 0);
            vid.Dislikes = Number(vid.Dislikes ?? 0);

            if (current === "dislike") {
                // undo dislike
                vid.Dislikes = Math.max(vid.Dislikes - 1, 0);
                delete state.userReactions[id];
            } else {
                // add dislike
                vid.Dislikes += 1;
                if (current === "like") {
                    vid.Likes = Math.max(vid.Likes - 1, 0);
                    // remove from likedVideos if switching away
                    state.likedVideos = state.likedVideos.filter(v => idOf(v) !== id);
                }
                state.userReactions[id] = "dislike";
            }
        },

        // overwrite from backend (optional)
        overwriteVideoCounts: (state, action) => {
            const updated = action.payload;
            const id = idOf(updated);
            const idx = state.items.findIndex(v => idOf(v) === id);
            if (idx >= 0) {
                state.items[idx] = { ...state.items[idx], ...updated };
            }
        },

        // === New reducers for liked videos ===
        setLikedVideos: (state, action) => {
            state.likedVideos = action.payload || [];
        },
        clearLikedVideos: (state) => {
            state.likedVideos = [];
        }
    },
});

export const {
    setVideos,
    addToWatchLater,
    removeFromWatchLater,
    toggleLike,
    toggleDislike,
    overwriteVideoCounts,
    setLikedVideos,
    clearLikedVideos,
} = videoSlice.actions;

export default videoSlice.reducer;
