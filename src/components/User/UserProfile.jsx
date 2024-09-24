import React, { useEffect, useState } from 'react'
import user from '../../assets/user1.jpg'
import './User.css'
import { useDispatch } from 'react-redux'
import { updateUserProfile, userProfile } from '../../redux-toolkit/Slice/userSlice'
import { Button, Modal } from 'react-bootstrap'
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import { getPost } from '../../redux-toolkit/Slice/postSlice'

const UserProfile = () => {
    const [post, setPost] = useState(0)
    const [show, setShow] = useState(false);
    const [profileData, setProfileData] = useState(null)
    const [image, setImage] = useState(null)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch()

    const BASE_URL = process.env.REACT_APP_BASE_URL
    const postModifiedImagePath = profileData?.profile

    console.log(postModifiedImagePath, "--------- modified path----------")
    useEffect(() => {
        getprofileData()
        getTotalPost()

    }, [])
    const getprofileData = async () => {
        const profileDetail = await dispatch(userProfile())
        // console.log(profileDetail.payload.data.data, "--------user Data-----")
        setProfileData(profileDetail.payload.data.data)
    }
    const initialValues = {
        fullName: profileData?.fullName,
        email: profileData?.email
    }

    const schemaValidation = Yup.object({
        fullName: Yup.string().required("fullname is required"),
        email: Yup.string().email('email is required').required("email is required")
    })

    const handleSubmit = async (data) => {
        try {
            console.log(data, "------ data in handleSubmit-----------")
            const formData = new FormData()
            formData.append('fullName', data.fullName)
            formData.append('email', data.email)
            if (image) {
                formData.append('profile', image)
            }
            const res = await dispatch(updateUserProfile({ userId: profileData._id, userData: formData }))
            console.log(res, "res of handleSunmit")
            if (res.meta.requestStatus === 'fulfilled') {
                getprofileData()
                handleClose()
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res?.payload?.data?.message || 'profile is not updated')
            }
        } catch (error) {
            throw error
        }
    }

    const getTotalPost = async () => {
        try {
            const res = await dispatch(getPost())
            console.log(res, " res of get all post")
            if (res.meta.requestStatus === 'fulfilled') {
                const totalPost = res.payload.data.length || 0
                setPost(totalPost)
            }
        } catch (error) {
            throw error
        }
    }

    return (
        <>
            <div className="container mt-5 mb-5 ">
                <button className='btn btn-outline-dark my-4' onClick={handleShow}>Edit Profile</button>
                <div className="row no-gutters">
                    <div className="col-md-4 col-lg-4 px-0">
                        <img src={profileData && profileData?.profile ? `${BASE_URL}/${postModifiedImagePath}` : user} />
                    </div>
                    <div className="col-md-8 col-lg-8 px-0">
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between align-items-center p-4 bg-dark text-white">
                                <h3 className="display-5">{profileData?.fullName}</h3></div>
                            <div className="p-3 bg-black text-white">
                                <h5>{profileData?.email}</h5>
                            </div>
                            <div className="d-md-flex flex-row text-white">
                                <div className="p-4 w-100 bg-primary text-center skill-block">
                                    <h4>20</h4>
                                    <h6>Follower</h6>
                                </div>
                                <div className="p-3 w-100 bg-success text-center skill-block">
                                    <h4>{post}</h4>
                                    <h6>Post</h6>
                                </div>
                                <div className="p-3 w-100 bg-warning text-center skill-block">
                                    <h4>30</h4>
                                    <h6>Tag</h6>
                                </div>
                                <div className="p-3 w-100 bg-danger text-center skill-block">
                                    <h4>100</h4>
                                    <h6>Archived</h6>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={schemaValidation}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ setFieldValue }) => (
                                <FormikForm>
                                    {/* {postModifiedImagePath && ( */}
                                    {/* <div className="mb-3">
                                        <img
                                            // src={`${BASE_URL}/${postModifiedImagePath}`}
                                            alt="Current Post"
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    </div> */}
                                    {/* )} */}
                                    <label htmlFor="profile">Upload Profile Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="profile"
                                        name='profile'
                                        onChange={(e) => {
                                            setFieldValue("profile", e.target.files[0])
                                            setImage(e.target.files[0])
                                        }}
                                    />
                                    {/* {postModifiedImagePath && <p>Current Image: {postModifiedImagePath}</p>} */}
                                    <label htmlFor="fullName">Enter User Name</label>
                                    <Field
                                        className='form-control'
                                        id='fullName'
                                        name='fullName'
                                    />
                                    <ErrorMessage name='fullName' component="div" className="text-danger" />

                                    <label htmlFor="email">Enter Email</label>
                                    <Field
                                        className='form-control'
                                        id='email'
                                        name='email'
                                    />
                                    <ErrorMessage name='email' component="div" className="text-danger" />
                                    <Button variant="primary" type='submit' className="mt-3">
                                        Update
                                    </Button>
                                </FormikForm>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
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

export default UserProfile
