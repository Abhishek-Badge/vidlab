import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



export function AdminAddVideo({ show, handleClose }) {

    const [categories, setCategories] = useState([{ CategoryId: 0, CategoryName: '' }]);

    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            Title: '',
            Description: '',
            Url: '',
            Likes: 0,
            Dislikes: 0,
            Views: 0,
            Comments: [''],
            CategoryId: 0,
            ChannelName: ''

        },

        onSubmit: (values) => {

            const selectedCat = categories.find(c => c.CategoryId === values.CategoryId);
            values.CategoryName = selectedCat?.CategoryName || "";

            axios.post(`http://127.0.0.1:5050/add-video`, values)
                .then(() => {
                    alert('Video Added Successfully');
                    formik.resetForm();
                    handleClose();
                    navigate('/admin-dash');

                })
                .catch((error) => {
                    alert("Error While adding Video");
                    console.error(error);
                });

        }
    });

    function LoadCategories() {
        axios.get(`http://127.0.0.1:5050/get-categories`)
            .then(response => {
                response.data.unshift({
                    CategoryId: -1,
                    CategoryName: 'Select a Category'
                })
                setCategories(response.data)
            })
    }

    useEffect(() => {

        LoadCategories();

    }, []);


    return (
        <Modal centered show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Add New Video</Modal.Title>
            </Modal.Header>

            <Form onSubmit={formik.handleSubmit} className='overflow-auto'>
                <Modal.Body>

                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="Title"
                            placeholder="Enter video title"
                            onChange={formik.handleChange}
                            value={formik.values.Title}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>URL</Form.Label>
                        <Form.Control
                            type="url"
                            name="Url"
                            placeholder="https://www.youtube.com/embed/..."
                            onChange={formik.handleChange}
                            value={formik.values.Url}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows="2"
                            cols="40"
                            name="Description"
                            placeholder="Enter video description"
                            onChange={formik.handleChange}
                            value={formik.values.Description}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Channel Name</Form.Label>
                        <Form.Control
                            type='text'
                            name="ChannelName"
                            placeholder="Enter Channel Name"
                            onChange={formik.handleChange}
                            value={formik.values.ChannelName}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Likes</Form.Label>
                        <Form.Control
                            type="number"
                            name="Likes"
                            placeholder="Enter likes count"
                            onChange={formik.handleChange}
                            value={formik.values.Likes}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Dislikes</Form.Label>
                        <Form.Control
                            type="number"
                            name="Dislikes"
                            placeholder="Enter dislikes count"
                            onChange={formik.handleChange}
                            value={formik.values.Dislikes}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Views</Form.Label>
                        <Form.Control
                            type="number"
                            name="Views"
                            placeholder="Enter views count"
                            onChange={formik.handleChange}
                            value={formik.values.Views}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Comments</Form.Label>
                        <Form.Control
                            type="text"
                            name="Comments"
                            placeholder="Enter comments"
                            onChange={formik.handleChange}
                            value={formik.values.Comments}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select onChange={formik.handleChange} value={formik.values.CategoryId} name="CategoryId" required>
                            {
                                categories.map(category =>
                                    <option key={category.CategoryId} value={category.CategoryId}>{category.CategoryName}</option>
                                )
                            }
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="success">Add Video</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}




