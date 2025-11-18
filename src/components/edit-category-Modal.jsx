import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { string } from "yup";

export function EditCategoryModal({ show, onHide, categoryId, refreshCategories }) {
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState({
        CategoryId: "",
        CategoryName: ""
    });

    // Load all categories (for duplicate checks)
    useEffect(() => {
        axios.get(`http://127.0.0.1:5050/get-categories`)
            .then(res => setCategories(res.data || []))
            .catch(err => console.error(err));
    }, []);

    // Load the selected category details (mirrors AdminEditVideo data-loading pattern)
    useEffect(() => {
        if (!categoryId) return;

        axios.get(`http://127.0.0.1:5050/get-categories/${categoryId}`)
            .then(res => {
                let data = Array.isArray(res.data) ? res.data[0] : res.data;
                setCurrentCategory(data || { CategoryId: "", CategoryName: "" });

            })
            .catch(err => console.error(err));
    }, [categoryId]);

    const formik = useFormik({
        initialValues: {
            CategoryId: currentCategory.CategoryId,
            CategoryName: currentCategory.CategoryName
        },
        enableReinitialize: true,
        validate: (values) => {
            const errors = {};

            if (!values.CategoryName?.trim()) {
                error.CategoryName = "Category name is Required";
            }

            // Front End duplicate check
            const isDuplicateName = categories.some(
                (c) =>
                    c.CategoryName.trim().toLowerCase().trim() === values.CategoryName.trim().toLowerCase() && Number(c.CategoryId) !== Number(currentCategory.CategoryId)

            );
            if (isDuplicateName) {
                errors.CategoryName = " This category name is already exists ";
            }

            return errors;
        },


        onSubmit: async (values) => {
            try {
                await axios.put(`http://127.0.0.1:5050/edit-category/${categoryId}`, {
                    CategoryId: Number(values.CategoryId),
                    CategoryName: values.CategoryName.trim()
                });
                refreshCategories?.();
                onHide?.();
            } catch (err) {
                if (err.response && err.response.status === 409) {
                    alert(" Category name already exists (server validaton).");
                } else {

                    console.error("Error updating category:", err);

                }

            }
        }
    });

    return (
        <Modal show={show} onHide={onHide} centered animation={true}>
            <Modal.Header closeButton className="bg-warning text-dark">
                <Modal.Title>
                    <i className="bi bi-pencil-square me-2"></i>Edit Category
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form onSubmit={formik.handleSubmit} id="edit-category-form">
                    <label className="form-label">Category ID</label>
                    <input
                        type="number"
                        name="CategoryId"
                        value={formik.values.CategoryId ?? ""}
                        className="form-control mb-3"
                        readOnly />

                    <label className="form-label">Category Name</label>
                    <input
                        type="text"
                        name="CategoryName"
                        value={formik.values.CategoryName ?? ""}
                        onChange={formik.handleChange}
                        className={`form-control ${formik.errors.CategoryName ? "is-invalid" : ""}`}
                    />
                    {formik.errors.CategoryName && (
                        <div className="invalid-feedback">{formik.errors.CategoryName}</div>
                    )}
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="success" type="submit" form="edit-category-form">
                    <i className="bi bi-check-circle me-1"></i>Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
