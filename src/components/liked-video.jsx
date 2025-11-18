import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SearchBar from "./search-bar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./user-dashboard.css";

export default function LikedVideos() {
    const likedVideos = useSelector((state) => state.videos?.likedVideos || []);
    const [filteredVideos, setFilteredVideos] = useState(likedVideos);

    useEffect(() => {
        setFilteredVideos(likedVideos);
    }, [likedVideos]);

    return (
        <div className="main-content p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                    <Link to="/user-dash" className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-arrow-left"></i>
                    </Link>
                    <h4 className="m-0">Liked Videos ❤️</h4>
                </div>
                <span className="text-muted">{likedVideos.length} liked</span>
            </div>

            <div className="mb-3">
                <SearchBar data={likedVideos} onResults={setFilteredVideos} />
            </div>

            {filteredVideos.length === 0 ? (
                <div className="alert alert-info text-center">
                    <i className="bi bi-info-circle"></i>{" "}
                    {likedVideos.length === 0
                        ? "You haven’t liked any videos yet."
                        : "No matching videos found."}
                </div>
            ) : (
                <div className="video-grid">
                    {filteredVideos.map((video, idx) => (
                        <div key={video.VideoId || video.id || idx} className="video-card card">
                            <iframe
                                className="card-img-top"
                                src={video.Url}
                                title={video.Title || `liked-${idx}`}
                                allowFullScreen
                            ></iframe>
                            <div className="card-body">
                                <h5 className="card-title text-truncate">{video.Title}</h5>
                                <div className="d-flex justify-content-between">
                                    <span>
                                        <i className="bi bi-eye"></i> {video.Views ?? 0}
                                    </span>
                                    <span>
                                        <i className="bi bi-hand-thumbs-up-fill text-primary"></i>{" "}
                                        {video.Likes ?? 0}
                                    </span>
                                </div>
                                <p
                                    className="btn btn-outline-danger bi bi-bell-fill w-100 mt-2"
                                    title="Channel Name"
                                >
                                    {video.ChannelName || "Unknown Channel"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
