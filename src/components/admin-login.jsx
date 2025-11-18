import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";


export function AdminLogin() {

    let navigate = useNavigate();

    const formik = useFormik({

        initialValues: {
            UserId: '',
            Password: ''
        },

        onSubmit: (admin) => {
            axios.get(`http://127.0.0.1:5050/get-admin`)
                .then(response => {
                    var user = response.data.find(item => item.UserId === admin.UserId);
                    if (user) {
                        if (admin.Password === user.Password) {
                            navigate("/admin-dash");
                        } else {
                            alert("Invalid Password")
                        }
                    } else {
                        alert('Invalid AdminId');
                    }
                })
        }
    })

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
            <div style={{ display: 'flex', width: '800px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', background: '#fff' }}>

                {/* Left Image */}
                <div style={{
                    flex: 1,
                    backgroundImage: 'https://source.unsplash.com/400x400/?technology,video', // add your image path
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>

                </div>

                {/* Right Login Form */}


                <div style={{ flex: 1, padding: '40px' }}>
                    <h3 className="bi bi-person-gear my-2 text-dark mb-2 ">Admin Login</h3>
                </div>
                <form className="text-dark " onSubmit={formik.handleSubmit}>
                    <dl className="mt-4">
                        <dt>AdminId</dt>
                        <dd><input type="text" name="UserId" onChange={formik.handleChange} className="form-control " /></dd>
                        <dt>Password</dt>
                        <dd><input type="password" name="Password" onChange={formik.handleChange} className="form-control " /></dd>
                    </dl>
                    <button className="btn btn-warning w-100 mt-3">Login</button>
                    <div className="my-2">
                        <Link className="text-secondary" to="/">Back to Home</Link>
                    </div>

                </form>
            </ div >
        </div>

    )
}







