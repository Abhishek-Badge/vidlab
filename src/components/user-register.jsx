import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";



export function Useregister() {

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            UserId: '',
            UserName: '',
            Password: '',
            Email: '',
            Mobile: ''
        },
        onSubmit: (user) => {
            axios.post(`http://127.0.0.1:5050/register-user`, user);
            alert("User Registered Successfully..")
            navigate('/user-login');
        }
    })

    return (
        <div>
            <div className="bg-light w-25 m-3 p-3 border border-5" style={{ borderRadius: '15px', border: '3px solid #ccc', padding: '10px' }}>
                <h3 className="bi bi-person-add">Register User</h3>

                <form onSubmit={formik.handleSubmit}>
                    <dl>
                        <dt>UserId</dt>
                        <dd><input type="text" name="UserId" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>UserName</dt>
                        <dd><input type="text" name="UserName" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Password</dt>
                        <dd><input type="password" name="Password" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Email</dt>
                        <dd><input type="email" name="Email" onChange={formik.handleChange} className="form-control"></input></dd>
                        <dt>Mobile</dt>
                        <dd><input type="mobile" name="Mobile" onChange={formik.handleChange} className="form-control" /></dd>
                    </dl>

                    <button className="btn btn-primary w-100">Register</button>
                    <div className="mt-3">
                        <span>Already signed up? <Link to="/user-login" className="text-black text-decoration-none fw-bold" > Click to log in</Link></span>
                    </div>


                </form>
            </div>
        </div>
    )
}