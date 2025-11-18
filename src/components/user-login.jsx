import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

export function UserLogin() {

    const [users, setUsers] = useState([{ UserId: '', UserName: '', Password: '', Email: '', Mobile: '' }]);

    const [cookies, setCookie, removeCookie] = useCookies(['username']);

    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            UserId: '',
            Password: ''
        },
        onSubmit: (user) => {

            axios.get(`http://127.0.0.1:5050/get-users`)
                .then(response => {
                    var result = response.data.find(item => item.UserId === user.UserId);

                    if (result) {
                        if (result) {
                            if (result.Password === user.Password) {
                                setCookie('username', result.UserName)
                                navigate('/user-dash');

                            } else {
                                alert('Invalid Password');
                            }
                        }
                    } else {
                        alert('Invalid User Id');
                    }
                })

        }

    })



    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
            <div className="bg-light p-2 m-2 w-25 mt-5" style={{ borderRadius: '18px', border: '3px solid #ccc', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>

                <div className="login-container">
                    <h3 className="bi bi-person-fill text-dark mb-2 ">User Login</h3>
                </div>
                <form className="text-dark " onSubmit={formik.handleSubmit}>
                    <dl>
                        <dt>UserId</dt>
                        <dd><input type="text" name="UserId" onChange={formik.handleChange} className="form-control " placeholder="Username" /></dd>
                        <dt>Password</dt>
                        <dd><input type="text" name="Password" onChange={formik.handleChange} className="form-control " placeholder="Password" /></dd>
                    </dl>

                    <button className="btn btn-warning form-control ">Login</button>
                    <div className="d-flex justify-content-baseline mx-2 mt-2">
                        <p >Don't have an account?</p>
                        <Link to="/register-user" className="text-primary ms-2">Register</Link>
                    </div>
                    <Link className="text-secondary mx-2" to="/" >Back to home </Link>

                </form>


            </div >

        </div>

    )
}