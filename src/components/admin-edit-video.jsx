import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";




export function AdminEditVideo() {

    const [categories, setCategories] = useState([]);
    const [videos, setVideos] = useState([{ VideoId: 0, Title: '', Url: '', Description: '', ChannelName: '', Likes: '', Dislikes: '', Views: '', Comments: [''], CategoryId: 0 }]);

    let params = useParams();
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            VideoId: videos[0].VideoId,
            Title: videos[0].Title,
            Url: videos[0].Url,
            Description: videos[0].Description,
            ChannelName: videos[0].ChannelName,
            Likes: videos[0].Likes,
            Dislikes: videos[0].Dislikes,
            Views: videos[0].Views,
            CategoryId: videos[0].CategoryId
        },
        onSubmit: (values) => {

            const selectedCat = categories.find(c => c.CategoryId === values.CategoryId);
            values.CategoryName = selectedCat?.CategoryName || "";

            axios.put(`http://127.0.0.1:5050/edit-video/${params.id}`, values)
                .then(() => {
                    alert('Video Updated Sucessfully..');
                    navigate('/admin-dash');
                })
                .catch(err => console.error(err));
        },
        enableReinitialize: true
    });


    function LoadCategories() {

        axios.get(`http://127.0.0.1:5050/get-categories`)
            .then(response => {
                response.data.unshift({
                    CategoryId: -1,
                    CategoryName: 'Select a Category'
                });
                setCategories(response.data);
            })
    }


    useEffect(() => {

        LoadCategories();

        axios.get(`http://127.0.0.1:5050/get-videos/${params.id}`)
            .then(response => {
                setVideos(response.data);
                console.log(response.data);
            })
    }, []);

    return (
        <div className="w-50 m-4 p-4" style={{ height: '750px', justifyContent: 'center', alignItems: 'center', }}>
            <header className="bg-danger" style={{ height: '50px', }}>
                <h3 className="text-light m-2 p-2">Edit Video</h3>
            </header>
            <body className="bg-light overflow-auto " style={{ height: '500px' }}>
                <form onSubmit={formik.handleSubmit} className="mt-3 m-2">
                    <dl>
                        <dt>VideoId</dt>
                        <dd><input type="text" value={formik.values.VideoId} onChange={formik.handleChange} name="VideoId" className="form-control" readOnly /></dd>
                        <dt>Title</dt>
                        <dd><input type="text" value={formik.values.Title} name="Title" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Url</dt>
                        <dd><input type="text" value={formik.values.Url} name="Url" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Description</dt>
                        <dd><input type="text" value={formik.values.Description} name="Description" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Channel Name</dt>
                        <dd><input type="text" value={formik.values.ChannelName} name="ChannelName" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Likes</dt>
                        <dd><input type="text" value={formik.values.Likes} name="Likes" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Dislikes</dt>
                        <dd><input type="text" value={formik.values.Dislikes} name="Dislikes" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Views</dt>
                        <dd><input type="text" value={formik.values.Views} name="Views" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Category</dt>
                        <select className="form-select" value={formik.values.CategoryId} onChange={formik.handleChange} name="CategoryId">

                            {
                                categories.map(category =>
                                    <option key={category.CategoryId} value={category.CategoryId}>{category.CategoryName}</option>
                                )
                            }

                        </select>
                    </dl>

                    <div className=" justify-content-between align-content-between m-2 ">
                        <Link to="/admin-dash" className="p-2 btn btn-secondary">Cancel</Link>
                        <button className="btn btn-success p-2 ms-2">Yes,Edit</button>

                    </div>
                </form>
            </body>


        </div>
    )
}