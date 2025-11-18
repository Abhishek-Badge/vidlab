import React, { useState, useEffect } from 'react';
import './admin-dashboard.css';
import { Button, Navbar, Container, Nav, } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AdminAddVideo } from './admin-addvideo';
import { AdminDeleteVideo } from './admin-delete video';
import { AddCategoryModal } from './add-categoryModal';
import { EditCategoryModal } from './edit-category-Modal';
import { DeleteCategoryModal } from './delete-category-Modal';
import SearchBar from './search-bar';  // use Global SearchBar


export function AdminDashboard() {

    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);  // for search /filter results

    useEffect(() => {
        axios.get("http://127.0.0.1:5050/get-videos").then((res) => {
            setVideos(res.data);
            setFilteredVideos(res.data);
        });
    }, []);


    // const [videos, setVideos] = useState([{ VideoId: 0, Title: '', Url: '', Description: '', Like: '', Dislikes: '', Views: '', Comments: [], CategoryId: 0, ChannelName: '' }]);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [showAddModal, setShowAddModal] = useState(false);

    //video modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    // Category States
    const [categories, setCategories] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [activeSection, setActiveSection] = useState("videos");    //"videos" or "categories"
    const [ShowEditCategory, setShowEditCategory] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [showDeleteCategory, setShowDeleteCategory] = useState(false);


    // Load all data when component mounts

    useEffect(() => {
        loadVideos();
        loadCategories();

    }, []);


    // Load  Videos from backend  

    const loadVideos = () => {
        axios.get(`http://127.0.0.1:5050/get-videos`)
            .then(res => {
                setVideos(res.data);
                setFilteredVideos(res.data);  // show all initially
            })
            .catch(err => console.error(err));
    };

    // Load Categories from Backend 

    function loadCategories() {
        axios.get(`http://127.0.0.1:5050/get-categories`)
            .then(response => setCategories(response.data))
            .catch(err => console.error(err));
    };


    // Dark Modal Toggle effect 

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
        localStorage.setItem("theme", darkMode ? "dark" : "light");

    }, [darkMode]);


    return (
        <div className="dashboard-container">
            {/* Header */}
            <Navbar bg="light" expand="lg" className="dashboard-header mb-1">
                <Container fluid>
                    <Navbar.Brand className="brand-name">VidLab</Navbar.Brand>
                    <Nav className='ms-auto d-flex align-items-center'>

                        {/*   Global  SearchBar */}
                        <SearchBar
                            onResults={(results) => {
                                setFilteredVideos(results.length ? results : videos);
                            }} >

                        </SearchBar>
                    </Nav>
                    <Nav className="ms-auto">
                        <div className="form-check form-switch ms-auto me-3 p-2 m-2">
                            <input
                                className="form-check-input "
                                type="checkbox"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />
                            <label className="form-check-label text-body">
                                {darkMode ? "Dark Mode" : "Light Mode"}
                            </label>
                        </div>
                        <div className='signout' >
                            <Link to='/' >
                                <Button className='btn btn-info p-2 m-2'>Signout<span className='bi bi-box-arrow-in-right'></span></Button>
                            </Link>
                        </div>

                    </Nav>
                </Container>
            </Navbar>

            {/* Body */}
            <div className="dashboard-body">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-section">
                        <Button variant="secondary" className="w-100 mb-2 ">Dashboard</Button>
                        <Button variant="light" className="w-100   m-2" onClick={() => setActiveSection("videos")}>
                            <i className='bi bi-camera-video-fill'></i>Videos</Button>
                        <Button variant="light" className="w-100 mb-2 m-2" onClick={() => setActiveSection("categories")}>
                            <i className='bi bi-list-ul '></i>Categories</Button>

                        <hr />

                        {activeSection === "categories" && (
                            <div>
                                <Button variant="light" className="w-100 mb-2 bi bi-plus-square-fill m-2 " onClick={() => setShowAddCategory(true)}>Add Category </Button>
                                <Button variant="light" className="w-100 mb-2 bi bi-pencil-fill m-2" onClick={() => setShowEditCategory(true)} >Edit Category</Button>
                                <Button variant="light" className="w-100 mb-2 bi bi-trash-fill m-2" onClick={() => setShowDeleteCategory(true)}>delete Category</Button>
                            </div>
                        )}

                        {activeSection === "videos" && (
                            <div>
                                <Button variant="light" className="w-100 mb-2 m-2" onClick={() => setShowAddModal(true)}>
                                    <i className="bi bi-camera-video-fill"></i> Add Video
                                </Button>
                                <Link to={`/edit-video/${videos.VideoId}`} >
                                    <Button variant="light" className="w-100 mb-2 m-2" onClick={() => setShowAddModal(true)}>
                                        <i className="bi bi-pencil-fill"></i> Edit Video
                                    </Button>
                                </Link>

                                <Button variant="light" className="w-100 mb-2 m-2" onClick={() => setShowDeleteModal(true)}>
                                    <i className="bi bi-trash-fill"></i> Delete Video
                                </Button>
                            </div>

                        )}

                    </div>
                    <hr />
                    <div className="sidebar-section">


                    </div>

                    <Link to='/user-login'>
                        <div className="sidebar-section">
                            <Button variant="info" className="w-100 mb-2">User Login</Button>
                            <Button className='w-100 bg-success'>Register User</Button>
                        </div>
                    </Link>
                </div>
                <hr />

                {/* Main Content */}
                <div>
                    {/*Videos Table*/}
                    <div className="main-content">
                        <h2 className='admin-dash-title my-2' style={{ textAlign: 'center', height: '10px' }}>Welcome to Admin Dashboard</h2>
                        {/* You can add routes or contents here */}
                    </div>


                    {/* Videos Table with search */}
                    {activeSection === "videos" && (
                        <div className="table-container ">
                            <div className="table-responsive ">
                                <table className="table table-hover table-bordered ">
                                    <thead>
                                        <tr className="table-info text-center">
                                            <th colSpan="5" className="fs-5">All Videos Summary</th>
                                        </tr>
                                        <tr >
                                            <th style={{ width: '50px' }}>#</th>
                                            <th style={{ width: '300px' }}>Title</th>
                                            <th style={{ width: '250px' }}>Category<br />Channel Name</th>
                                            <th style={{ width: '350px' }}>Preview</th>
                                            <th style={{ width: '300px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredVideos.map((video, index, idx) => (

                                                <tr key={`${video.VideoId}-${idx}`} style={{ height: '200px' }}>
                                                    <td>{index + 1}</td>
                                                    <td>{video.Title}</td>
                                                    <td>{video.CategoryId}<br />{video.ChannelName}</td>
                                                    <td style={{ width: '300px', height: '200px' }}>
                                                        <iframe src={video.Url} title={video.Title} width="350px" height="200px" allowFullScreen ></iframe>
                                                    </td>
                                                    <td className='button-bar '>

                                                        <Link to={`/edit-video/${video.VideoId}`} className='bi bi-pen-fill me-2 btn btn-primary ms-2'></Link>

                                                        <Button
                                                            className='btn btn-danger'
                                                            onClick={() => {
                                                                setSelectedVideoId(video.VideoId);  // store Video Id
                                                                setShowDeleteModal(true);
                                                            }}>
                                                            <i className='bi bi-trash3-fill'></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Categories Table*/}



                    {activeSection === "categories" && (

                        <div className="table-category mt-2 mx-5 ">
                            <table className='table table-hover table-bordered ' style={{ width: '1200px' }}>
                                <thead>
                                    <tr className='table-success text-center'>
                                        <th colSpan="4" className='fs-5 table-primary '>All Categories List</th>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '30px', height: '50px' }}>#</th>
                                        <th style={{ width: '100px', height: '50px' }}>Category ID</th>
                                        <th style={{ width: '150px', height: '50px' }}>Category Name</th>
                                        <th style={{ width: '140px', height: '50px' }}>Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, index) => (
                                        <tr key={cat.CategoryId}>
                                            <td>{index + 1}</td>
                                            <td>{cat.CategoryId}</td>
                                            <td>{cat.CategoryName}</td>
                                            <td>
                                                <Button
                                                    className=" bi bi-pencil-square me-2"
                                                    variant='warning'
                                                    size='sm'
                                                    onClick={() => {
                                                        setSelectedCategoryId(cat.CategoryId);
                                                        setShowEditCategory(true);

                                                    }}>
                                                </Button>
                                                <Button
                                                    className="bi bi-trash-fill"
                                                    variant='danger'
                                                    size='sm'
                                                    onClick={() => {
                                                        setSelectedCategoryId(cat.CategoryId);
                                                        setShowDeleteCategory(true);
                                                    }}>

                                                </Button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}



                </div >
            </div >



            < AdminAddVideo show={showAddModal} handleClose={() => { setShowAddModal(false); loadVideos(); }
            } />

            {
                showDeleteModal && (
                    <AdminDeleteVideo show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} VideoId={selectedVideoId} />

                )
            }


            {
                showDeleteModal && (
                    <AdminDeleteVideo
                        show={showDeleteModal}
                        handleClose={() => {
                            setShowDeleteModal(false);
                            loadVideos();        //refresh after delete
                        }}
                        VideoId={selectedVideoId} />
                )
            }



            < AddCategoryModal show={showAddCategory} onHide={() => setShowAddCategory(false)} refreshCategories={loadCategories} />

            {  /* Edit Category Modal */}

            < EditCategoryModal
                show={ShowEditCategory}
                onHide={() => setShowEditCategory(false)}
                categoryId={selectedCategoryId}
                refreshCategories={loadCategories}
            />

            {/*Delete Category Modal */}

            < DeleteCategoryModal
                show={showDeleteCategory}
                handleClose={() => setShowDeleteCategory(false)}
                CategoryId={selectedCategoryId}
                refreshCategories={loadCategories}
            ></DeleteCategoryModal >

        </div >
    );

}