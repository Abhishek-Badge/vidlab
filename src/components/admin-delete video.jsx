import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export function AdminDeleteVideo({ show, handleClose, VideoId }) {
    const [video, setVideo] = useState({
        VideoId: 0,
        Title: '',
        Url: '',
        Description: '',
        ChannelName: '',
        Likes: 0,
        Dislikes: 0,
        Views: 0,
        Comments: [''],
        CategoryId: 0,

    });


    useEffect(() => {
        if (VideoId) {
            axios.get(`http://127.0.0.1:5050/get-videos/${VideoId}`)
                .then(response => setVideo(response.data[0] || response.data));
        }
    }, [VideoId]);

    function handleDeleteClick() {
        console.log("Deleting video ID;", VideoId)
        axios.delete(`http://127.0.0.1:5050/delete-video/${VideoId}`)
            .then(() => {
                alert("Video Deleted..");
                handleClose();
            })
            .catch(err => console.error("Delete error:", err));

    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h5 className="text-danger">Are you sure, you want to Delete this video?</h5>
                <dl className="mt-3">
                    <dt>Title</dt>
                    <dd>{video.Title}</dd>
                    <dt>Description</dt>
                    <dd>{video.Description}</dd>
                    <dt>Channel Name</dt>
                    <dd>{video.ChannelName}</dd>
                    <dt>Likes</dt>
                    <dd>{video.Likes}</dd>
                    <dt>Dislikes</dt>
                    <dd>{video.Dislikes}</dd>
                    <dt>Views</dt>
                    <dd>{video.Views}</dd>
                </dl>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}> Cancel </Button>
                <Button variant="danger" onClick={handleDeleteClick}> Yes, Delete </Button>
            </Modal.Footer>
        </Modal>
    );
}
