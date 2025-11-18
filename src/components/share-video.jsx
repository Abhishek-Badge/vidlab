import React from "react";
import "./share-video.css";

export default function ShareVideo({ show, onClose, video }) {

    if (!show || !video) return null;

    const handleCopy = () => {

        navigator.clipboard.writeText(video.Url);
        alert("Copied to clipboard");
    };

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-custom card shadow-lg p-3 animate-modal">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="m-0">Share Video</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                {/* Video Preview*/}

                <div className="ratio ratio-16x9 mb-2">
                    <iframe src={video.Url} title={video.Title} allowFullScreen></iframe>
                </div>

                <p className="fw-bold">{video.Title}</p>

                {/* Copy Link */}
                <div className="input-group mb-3">
                    <input type="text" className="form-control" value={video.Url} readOnly />
                    <button className="btn btn-outline-primary" onClick={handleCopy}>Copy</button>
                </div>

                {/* Social Buttons */}
                <div className="d-flex justify-content-around">
                    <a
                        href={`https://wa.me/?text=${video.Url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success btn-sm"
                    >
                        <i className="bi bi-whatsapp" data-bs-toggle="tooltip" title="WhatsApp"></i>
                    </a>

                    <a
                        href={`https://twitter.com/intent/tweet?url=${video.Url}&text=check this video!`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-info btn-sm"
                    >
                        <i className="bi bi-twitter" data-bs-toggle="tooltip" title="Twitter"></i>
                    </a>

                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${video.Url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-Primary btn-sm"
                    >
                        <i className="bi bi-linkedin" data-bs-toggle="tooltip" title="Linkedin"></i>
                    </a>

                    <a
                        href={`mailto:?subject=watch this video&body=${video.Url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-danger btn-sm"
                    >
                        <i className="bi bi-envelope" data-bs-toggle="tooltip" title="Email"></i>
                    </a>
                </div>
            </div>

        </div>
    );
}

