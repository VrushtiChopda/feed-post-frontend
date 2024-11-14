import { ErrorMessage, Formik } from 'formik'
import React from 'react'
import { object, string } from 'yup'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { userLogin } from '../redux-toolkit/Slice/userSlice'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const schemaValidation = object({
        email: string().email("enter valid email").required("email is required"),
        password: string().min(5, "enter minimum 5 characters").max(15, "enter maximum 15 characters").required("password is required")
    })

    const handleLoginSubmit = async (data) => {
        try {
            const loginDetail = await dispatch(userLogin(data))
            console.log(loginDetail, "--------- loginDetail-------------")
            if (loginDetail.meta.requestStatus === 'fulfilled') {
                toast.success("Login successfully", {
                    onClose: () => {
                        navigate('/dashboard/posts');
                    },
                });
            } else if (loginDetail.meta.requestStatus === 'rejected') {
                toast.error(loginDetail.payload);
            }
        } catch (error) {
            throw error
        }
    }

    return (
        <>
            <div className='main-container'>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={schemaValidation}
                    onSubmit={handleLoginSubmit}
                >
                    {(formik) => (
                        <div className='d-flex justify-content-center'>
                            <form onSubmit={formik.handleSubmit} className='form-design p-5 border rounded-4 shadow '>
                                <h1 className='text-center mb-4'>Sign In</h1>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email address</label>
                                    <input type="email"
                                        className="form-control"
                                        id="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                    />
                                    <ErrorMessage name='email' component="div" className="text-danger" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input type="password"
                                        className="form-control"
                                        id="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                    />
                                    <ErrorMessage name='password' component="div" className="text-danger" />

                                </div>
                                <div className='d-grid mb-3'>
                                    <button
                                        type="submit"
                                        className="btn btn-outline-dark btn-block"
                                    >Login</button>
                                </div>
                                <div className='text-center link'>
                                    Not registered yet? <Link to='/register' className='text-black text-decoration-underline'>Register Now</Link>
                                </div>
                            </form>
                        </div>
                    )}
                </Formik>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme='dark'
                />
            </div>
        </>
    )
}

export default Login
