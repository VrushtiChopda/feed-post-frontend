import { Formik } from 'formik'
import React from 'react'
import './registration.css'
import { object, string } from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { userRegister } from '../redux-toolkit/Slice/userSlice'

const Registration = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const schemaValidation = object({
        fullName: string().required("full name is required"),
        email: string().email("enter valid email").required("email is required"),
        password: string().min(5, "enter minimum 5 characters").max(15, "enter maximum 15 characters").required("password is required")
    })
    const handleRegisterSubmit = async (data) => {
        try {
            console.log(data, "data in registration")
            const regData = await dispatch(userRegister(data))
            console.log(regData, "regData")
            if (regData.meta.requestStatus === 'fulfilled') {
                toast.success("registration Successfully", {
                    onClose: () => {
                        navigate('/')
                    }
                })
            }
        } catch {
            toast.error("registration failed")
        }
    }
    return (
        <>
            <div className='reg-container'>
                <Formik
                    initialValues={{ fullName: "", email: "", password: "" }}
                    validationSchema={schemaValidation}
                    onSubmit={handleRegisterSubmit}
                >
                    {(formik) => (
                        <div className='d-flex justify-content-center'>
                            <form onSubmit={formik.handleSubmit} className='reg-form p-5 border border-1 rounded-4 shadow '>
                                <h1 className='text-center mb-3'>Sign up</h1>
                                <div className="form-group mb-3">
                                    <label
                                        htmlFor="fullName"
                                    >Full name</label>
                                    <input
                                        type="fullName"
                                        className="form-control"
                                        id="fullName"
                                        value={formik.values.fullName}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label
                                        htmlFor="email"
                                    >Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label
                                        htmlFor="password"
                                    >Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className='d-grid mb-3'>
                                    <button
                                        type="submit"
                                        className="btn btn-outline-dark btn-block"
                                    >Register</button>
                                </div>
                                <div className='text-center link1'>
                                    Already have an account?
                                    <Link to='/' className='text-black text-decoration-underline'> Login </Link>
                                </div>
                            </form>
                        </div>
                    )}
                </Formik>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
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

export default Registration
