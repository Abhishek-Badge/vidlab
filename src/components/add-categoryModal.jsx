import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, } from "react-bootstrap";
import { Form } from "react-bootstrap";




export function AddCategoryModal({ show, onHide, refreshCategories }) {

    const [form, setForm] = useState({ CategoryName: "" });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");


    useEffect(() => {
        // Load existing categories to check duplicates in frontend

        axios.get("http://127.0.0.1:5050/get-categories")
            .then(res => setCategories(res.data))
            .catch(err => console.error("Error loading categories:", err));
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });

    }

    async function handleSave() {
        const categoryNameTrim = form.CategoryName.trim().toLowerCase();

        if (!form.CategoryName.trim()) {
            setError(" Category name is Required.");
            return;
        }

        // Frontend Checks (fast validation)

        const nameExists = categories.some(c => c.CategoryName.trim().toLowerCase() === categoryNameTrim);


        if (nameExists) {
            setError(" This Category Name already exists!");
            return;
        }

        try {
            // Backend checks (final authority)

            await axios.post("http://127.0.0.1:5050/add-category", {

                CategoryName: form.CategoryName.trim()
            });

            refreshCategories();
            onHide();
            setForm({ CategoryName: "" });
            setError("");

        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError(" This Category name already exists!");

            } else {

                setError("Error adding category. Please try again.");

            }

        }

    }


    return (

        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Add Category</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="CategoryName"
                        value={form.CategoryName}
                        onChange={handleChange}
                        Placeholder="Enter Category Name"
                    />
                </Form.Group>

                {error && <p className="text-danger mt-2">{error}</p>}
            </Modal.Body>

            <Modal.Footer>
                <Button varient="warning" className="btn btn-secondary" onClick={onHide} >Cancel</Button>
                <Button varient="success" onClick={handleSave} >Add</Button>
            </Modal.Footer>
        </Modal>


    );
}