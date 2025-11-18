import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col, Badge } from "react-bootstrap";
import { removeFromWatchLater } from "../slicers/video-slicer";
import SearchBar from "./search-bar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./user-dashboard.css";

export default function WatchLaterPage() {
    const dispatch = useDispatch();
    const watchLater = useSelector((state) => state.videos?.watchLater || []);
    const [filteredVideos, setFilteredVideos] = useState(watchLater);

    useEffect(() => {
        setFilteredVideos(watchLater);
    }, [watchLater]);

    const handleRemove = (id) => {
        dispatch(removeFromWatchLater(id));
    };

    if (!watchLater.length) {
        return (
            <div className="container py-5">
                <div className="text-start mb-3">
                    <Link to="/user-dash" className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-arrow-left"></i> Back
                    </Link>
                </div>
                <div className="text-center">
                    <h3 className="mb-2">Nothing saved yet</h3>
                    <p className="text-muted mb-4">
                        Save videos to watch them here later.
                    </p>
                    <Link to="/user-dash" className="btn btn-primary">
                        Browse Videos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                    <Link to="/dashboard" className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-arrow-left"></i>
                    </Link>
                    <h4 className="m-0">Watch Later</h4>
                </div>
                <Badge bg="secondary">{watchLater.length} saved</Badge>
            </div>

            <div className="mb-3">
                <SearchBar data={watchLater} onResults={setFilteredVideos} />
            </div>

            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                {filteredVideos.map((v, idx) => (
                    <Col key={v.VideoId || v.id || idx}>
                        <Card className="h-100 shadow-sm">
                            <div className="ratio ratio-16x9">
                                <iframe
                                    title={v.Title || `video-${idx}`}
                                    src={v.Url}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fs-6 text-truncate" title={v.Title}>
                                    {v.Title || "Untitled"}
                                </Card.Title>
                                <Card.Text className="text-muted mb-2">
                                    {v.ChannelName || "Channel"} •{" "}
                                    {v.Views ? `${v.Views} views` : ""}
                                </Card.Text>
                                <div className="mt-auto d-flex gap-2">
                                    <a
                                        className="btn btn-outline-primary btn-sm"
                                        href={v.Url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className="bi bi-box-arrow-up-right me-1" />
                                        Open
                                    </a>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleRemove(v.VideoId || v.id)}
                                    >
                                        <i className="bi bi-trash3 me-1" />
                                        Remove
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
