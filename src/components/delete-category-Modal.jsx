import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";




export function DeleteCategoryModal({ show, handleClose, CategoryId, refreshCategories }) {

    const [categories, setCategories] = useState({

        CategoryId: 0,
        CategoryName: ''
    });


    useEffect(() => {

        if (CategoryId) {
            axios.get(`http://127.0.0.1:5050/get-categories/${CategoryId}`)
                .then(response => setCategories(response.data[0] || response.data));
        }

    }, [CategoryId]);

    function handleDeleteClick() {
        console.log("Deleting category ID;", CategoryId)

        axios.delete(`http://127.0.0.1:5050/delete-category/${CategoryId}`)
            .then(() => {
                alert("Category Deleted..");
                handleClose();
                refreshCategories();
            })
            .catch(err => console.error("Delete error:", err));

    };



    return (

        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title>
                    <i className="bi bi-trash-fill me-2"></i>Delete Category
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h5 className="text-danger">Are you sure, you want to Delete Category?</h5>
                <dl className="mt-3">
                    <dt>CategoryId</dt>
                    <dd>{categories.CategoryId}</dd>
                    <dt>Category Name</dt>
                    <dd>{categories.CategoryName}</dd>
                </dl>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}> Cancel  </Button>

                <Button variant="danger" onClick={handleDeleteClick}>
                    <i className="bi bi-trash-fill me-1"></i>Delete
                </Button>
            </Modal.Footer>
        </Modal>

    );
}