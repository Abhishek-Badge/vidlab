// src/components/user-dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./user-dashboard.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    setVideos,
    addToWatchLater,
    toggleLike,
    toggleDislike,
    setLikedVideos,
} from "../slicers/video-slicer";
import ShareVideo from "./share-video";
import SearchBar from "./search-bar"; //✅ new hybrid search bar

export function UserDashboard() {
    const [, , removeCookie] = useCookies(["username"]);
    const [cookies] = useCookies(["username"]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [shareVideoData, setShareVideoData] = useState(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // ✅ for search results
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [searchActive, setSearchActive] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams(); // New for URL sync

    // Redux state
    const videos = useSelector((state) => (state.videos && state.videos.items) || []);
    const userReactions = useSelector((state) => (state.videos && state.videos.userReactions) || {});

    // category bar refs + scroll state
    const barRef = useRef(null);
    const pillRefs = useRef([]); // array of node refs (All + categories)
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Configure how many items to shift on arrow click
    const SHIFT_COUNT = 3;

    // ✅ handle search results from SearchBar
    const handleSearchResults = (results) => {
        if (results && results.length > 0) {
            setFilteredVideos(results);
            setSearchActive(true);
        } else {
            setFilteredVideos([]);
            setSearchActive(false);
        }
    };

    // Read Category from URL on first Load
    useEffect(() => {
        const catFormUrl = searchParams.get("category");
        if (catFormUrl) {
            setSelectedCategory(parseInt(catFormUrl));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount

    // Fetch Categories
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:5050/get-categories`)
            .then((res) => setCategories(res.data || []))
            .catch((err) => console.error("Error fetching categories", err));
    }, []);

    // Fetch videos
    const fetchVideos = (categoryId = null) => {
        setLoading(true);

        const url = categoryId
            ? `http://127.0.0.1:5050/filter-videos/${categoryId}`
            : "http://127.0.0.1:5050/get-videos";

        axios
            .get(url)
            .then((res) => {
                dispatch(setVideos(res.data));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching videos", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchVideos(selectedCategory);
    }, [selectedCategory]);

    // central handler for category changes (updates State + URL)
    const handleCategoryChange = (categoryId) => {
        if (categoryId) {
            setSelectedCategory(parseInt(categoryId));
            setSearchParams({ category: categoryId }); // update URL
        } else {
            setSelectedCategory(null);
            setSearchParams({}); // Clear URL param
        }
    };

    // Load all videos into Redux once
    useEffect(() => {
        axios
            .get("http://127.0.0.1:5050/get-videos")
            .then((res) => {
                dispatch(setVideos(res.data));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching videos", err);
                setLoading(false);
            });
    }, [dispatch]);

    // Load liked videos when Logged in
    useEffect(() => {
        if (cookies["username"]) {
            axios
                .get(`http://127.0.0.1:5050/users/${cookies["username"]}/liked-videos`)
                .then((res) => dispatch(setLikedVideos(res.data)))
                .catch((err) => console.error("Error fetching liked videos", err));
        }
    }, [cookies, dispatch]);

    // Signout
    const handleSignout = () => {
        removeCookie("username");
        navigate("/user-login");
    };

    const handleSaveClick = (video) => {
        alert("Video Saved to Watch Later!");
        dispatch(addToWatchLater(video));
    };

    // Like & Dislike handlers (same as before)
    const handleLike = async (videoId) => {
        try {
            await axios.post(`http://127.0.0.1:5050/videos/${videoId}/reaction`, {
                userId: cookies["username"],
                reaction: "like",
            });

            dispatch(toggleLike(videoId));

            // Refresh liked videos dynamically
            const likedRes = await axios.get(
                `http://127.0.0.1:5050/users/${cookies["username"]}/liked-videos`
            );
            dispatch(setLikedVideos(likedRes.data));
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleDislike = async (videoId) => {
        try {
            await axios.post(`http://127.0.0.1:5050/videos/${videoId}/reaction`, {
                userId: cookies["username"],
                reaction: "dislike",
            });

            dispatch(toggleDislike(videoId));

            const likedRes = await axios.get(
                `http://127.0.0.1:5050/users/${cookies["username"]}/liked-videos`
            );
            dispatch(setLikedVideos(likedRes.data));
        } catch (err) {
            console.error("Dislike failed", err);
        }
    };

    // ---- Category bar scrolling logic ----
    // Keep pillRefs array in sync for current count (All + categories)
    const totalPills = (categories?.length || 0) + 1; // +1 for "All"
    pillRefs.current = Array(totalPills).fill(null);

    useEffect(() => {
        // update scroll button states
        const update = () => {
            const bar = barRef.current;
            if (!bar) return;
            setCanScrollLeft(bar.scrollLeft > 2);
            setCanScrollRight(bar.scrollLeft + bar.clientWidth < bar.scrollWidth - 2);
        };

        update();
        window.addEventListener("resize", update);
        const bar = barRef.current;
        if (bar) bar.addEventListener("scroll", update);

        return () => {
            window.removeEventListener("resize", update);
            if (bar) bar.removeEventListener("scroll", update);
        };
    }, [categories]);

    const scrollByItems = (count) => {
        const bar = barRef.current;
        const children = pillRefs.current;
        if (!bar || !children.length) return;

        // find first visible index (the left-most pill that has any visible part after bar.scrollLeft)
        let firstIndex = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (!child) continue;
            if (child.offsetLeft + child.offsetWidth > bar.scrollLeft + 1) {
                firstIndex = i;
                break;
            }
        }

        let targetIndex = firstIndex + count;
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex > children.length - 1) targetIndex = children.length - 1;

        const target = children[targetIndex];
        if (target) {
            // offset a little so there's small left padding visible
            const leftPadding = 8;
            bar.scrollTo({ left: Math.max(0, target.offsetLeft - leftPadding), behavior: "smooth" });
        }
    };

    // -------------------------------------------------

    return (
        <div
            className={`dashboard ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"} ${darkMode ? "dark-mode" : "light-mode"
                }`}
        >
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
                <div className="sidebar-header d-flex justify-content-between align-items-center">
                    {sidebarOpen && <span>Hello, {cookies["username"] || "User"}</span>}
                    <button className="btn toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <i className="bi bi-list"></i>
                    </button>
                </div>

                <ul className="nav flex-column mt-3">
                    <li className="nav-item" title="Home">
                        <i className="bi bi-house-door"></i> {sidebarOpen && "Home"}
                    </li>
                    <li className="nav-item" title="Playlists">
                        <i className="bi bi-collection-play"></i> {sidebarOpen && "Playlists"}
                    </li>

                    {/* Category Dropdown inside sidebar */}
                    {sidebarOpen && (
                        <li className="nav-item" title="Categories">
                            <i className="bi bi-grid"></i>{" "}
                            <select
                                className="form-select mt-2"
                                onChange={(e) => handleCategoryChange(e.target.value || null)}
                                value={selectedCategory || ""}
                            >
                                <option value=" ">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.CategoryId} value={cat.CategoryId}>
                                        {cat.CategoryName}
                                    </option>
                                ))}
                            </select>
                        </li>
                    )}

                    <li className="nav-item" title="History">
                        <i className="bi bi-clock-history"></i> {sidebarOpen && "History"}
                    </li>

                    <li
                        className="nav-item"
                        title="Watch Later"
                        onClick={() => navigate("/watch-later")}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="bi bi-clock"></i> {sidebarOpen && "Watch Later"}
                    </li>

                    <li
                        className="nav-item"
                        title="Liked Videos"
                        onClick={() => navigate("/liked-video")}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="bi bi-hand-thumbs-up"></i> {sidebarOpen && "Liked Videos"}
                    </li>
                </ul>

                {sidebarOpen && <hr />}
                {sidebarOpen && (
                    <button className="btn btn-danger w-100 signout-btn mt-2" onClick={handleSignout}>
                        <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                )}
            </div>

            {/* Main Content */}
            <div className="main-content">
                <header className="dashboard-header d-flex justify-content-between align-items-center p-2">
                    <h3 className="brand">VidLab</h3>

                    <div className="search-bar">
                        <SearchBar onResults={handleSearchResults} /> {/* ✅ integrated */}
                    </div>

                    <div className="header-actions d-flex align-items-center">
                        {/* Dark Mode Toggle */}
                        <button
                            className="btn theme-toggle me-3 fs-4 btn btn-outline-warning border-0"
                            onClick={() => setDarkMode(!darkMode)}
                            title={darkMode ? "Light Mode" : "Dark Mode"}
                        >
                            <i className={darkMode ? "bi bi-sun" : "bi bi-moon"}></i>
                        </button>

                        {/* Notification */}
                        <div className="notification position-relative me-3 fs-4 ">
                            <i className="bi bi-bell btn btn-outline-danger border-0 fs-4"></i>
                            <div className="notification-popup ">
                                <p>
                                    <i className="bi bi-upload"></i> New video Uploaded
                                </p>
                                <p>
                                    <i className="bi bi-hand-thumbs-up"></i> Someone liked your video
                                </p>
                                <p>
                                    <i className="bi bi-chat-left"></i> New comment received
                                </p>
                                <p>
                                    <i className="bi bi-share"></i> Video Shared
                                </p>
                            </div>
                        </div>

                        {/* Profile */}
                        <div className="profile-dropdown position-relative ">
                            <i className="bi bi-person-circle btn btn-outline-info border-0 fs-4"></i>
                            <div className="profile-popup">
                                <p>
                                    <strong>{cookies["username"] || "User"}</strong>
                                </p>
                                <p>user@example.com</p>
                                <button className="btn btn-sm btn-outline-secondary w-100">Settings</button>
                                <button className="btn btn-sm btn-outline-danger w-100 mt-1" onClick={handleSignout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Top Horizontal Category Bar - SLIDE MODE (new) */}
                <div className="category-wrap">
                    {/* left chevron */}
                    {categories.length > SHIFT_COUNT && (
                        <button
                            className={`cat-scroll-btn left ${canScrollLeft ? "" : "disabled"}`}
                            onClick={() => scrollByItems(-SHIFT_COUNT)}
                            aria-label="Scroll categories left"
                            title="Previous"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                    )}

                    <div
                        className="category-bar d-flex gap-2 mb-3 overflow-auto"
                        ref={barRef}
                        role="tablist"
                        aria-label="Categories"
                    >
                        {/* "All" pill (index 0) */}
                        <button
                            ref={(el) => (pillRefs.current[0] = el)}
                            className={`category-pill btn-sm ${!selectedCategory ? "active" : ""}`}
                            onClick={() => handleCategoryChange(null)}
                        >
                            All
                        </button>

                        {categories.map((cat, idx) => (
                            <button
                                key={cat.CategoryId}
                                ref={(el) => (pillRefs.current[idx + 1] = el)} // +1 to account for "All"
                                className={`category-pill btn-sm ${selectedCategory === cat.CategoryId ? "active" : ""}`}
                                onClick={() => handleCategoryChange(cat.CategoryId)}
                            >
                                {cat.CategoryName}
                            </button>
                        ))}
                    </div>

                    {/* right chevron */}
                    {categories.length > SHIFT_COUNT && (
                        <button
                            className={`cat-scroll-btn right ${canScrollRight ? "" : "disabled"}`}
                            onClick={() => scrollByItems(SHIFT_COUNT)}
                            aria-label="Scroll categories right"
                            title="Next"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    )}
                </div>

                {/* Videos */}
                <div className="video-section p-3">
                    {loading ? (
                        <div className="loading">Loading videos...</div>
                    ) : (
                        <div className="video-grid">
                            {(searchActive ? filteredVideos : videos).map((video, idx) => (
                                <div key={`${video.VideoId}-${idx}`} className="video-card card">
                                    <iframe className="card-img-top" src={video.Url} title={video.Title} allowFullScreen></iframe>
                                    <div className="card-body">
                                        <h5 className="card-title">{video.Title}</h5>

                                        <div className="video-stats d-flex justify-content-between mt-3">
                                            <span>
                                                <i className="bi bi-eye" title="Views"></i> {video.Views ?? 0}
                                            </span>

                                            <span onClick={() => handleLike(video.VideoId)} style={{ cursor: "pointer" }} title="Like">
                                                <i
                                                    className={`bi  ${userReactions[video.VideoId] === "like"
                                                        ? "bi-hand-thumbs-up-fill text-primary"
                                                        : " bi-hand-thumbs-up"
                                                        }`}
                                                ></i>{" "}
                                                {video.Likes ?? 0}
                                            </span>

                                            <span onClick={() => handleDislike(video.VideoId)} style={{ cursor: "pointer" }} title="Dislike">
                                                <i
                                                    className={`bi  ${userReactions[video.VideoId] === "dislike"
                                                        ? "bi-hand-thumbs-down-fill text-primary"
                                                        : "bi-hand-thumbs-down"
                                                        }`}
                                                ></i>{" "}
                                                {video.Dislikes ?? 0}
                                            </span>

                                            <span title="Save">
                                                <i className="bi bi-save" style={{ cursor: "pointer" }} onClick={() => handleSaveClick(video)}></i>
                                            </span>

                                            <span title="Share">
                                                <i className="bi bi-share" style={{ cursor: "pointer" }} onClick={() => setShareVideoData(video)}></i>
                                            </span>
                                        </div>

                                        <p className="btn btn-outline-danger bi bi-bell-fill w-60 mb-2" title="Channel Name" style={{ marginTop: "30px" }}>
                                            {video.ChannelName || "Unknown Channel"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Share Popup */}
            <ShareVideo show={!!shareVideoData} onClose={() => setShareVideoData(null)} video={shareVideoData} />
        </div>
    );
}
