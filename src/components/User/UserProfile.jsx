import React, { useEffect, useState } from 'react'
import user from '../../assets/user1.jpg'
import './User.css'
import { useDispatch } from 'react-redux'
import { userProfile } from '../../redux-toolkit/Slice/userSlice'
import { Button, Modal } from 'react-bootstrap'
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'

const UserProfile = () => {
    const [show, setShow] = useState(false);
    const [profile, setProfile] = useState(null)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch()
    useEffect(() => {
        const profileData = async () => {
            const profileDetail = await dispatch(userProfile())
            // console.log(profileDetail.payload.data.data, "--------user Data-----")
            setProfile(profileDetail.payload.data.data)
        }
        profileData()
    }, [])

    return (
        <>

            <div className="container mt-5 mb-5 ">
                <button className='btn btn-outline-dark my-4' onClick={handleShow}>Edit Profile</button>
                <div className="row no-gutters">
                    <div className="col-md-4 col-lg-4 px-0">
                        <img src={user} />
                    </div>
                    <div className="col-md-8 col-lg-8 px-0">
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between align-items-center p-4 bg-dark text-white">
                                <h3 className="display-5">{profile?.fullName}</h3></div>
                            <div className="p-3 bg-black text-white">
                                <h5>{profile?.email}</h5>
                            </div>
                            <div className="d-md-flex flex-row text-white">
                                <div className="p-4 w-100 bg-primary text-center skill-block">
                                    <h4>20</h4>
                                    <h6>Follower</h6>
                                </div>
                                <div className="p-3 w-100 bg-success text-center skill-block">
                                    <h4>10</h4>
                                    <h6>Post</h6>
                                </div>
                                <div className="p-3 w-100 bg-warning text-center skill-block">
                                    <h4>30</h4>
                                    <h6>Tag</h6>
                                </div>
                                <div className="p-3 w-100 bg-danger text-center skill-block">
                                    <h4>100</h4>
                                    <h6>History</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                        // initialValues={initialValues}
                        // validationSchema={schemaValidation}
                        // onSubmit={handleSubmit}
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
                                    <label htmlFor="postImage">Upload Profile Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="postImage"
                                        name='postImage'
                                        onChange={(e) => {
                                            setFieldValue("postImage", e.target.files[0])
                                            // setImage(e.target.files[0])
                                        }}
                                    />
                                    {/* {postModifiedImagePath && <p>Current Image: {postModifiedImagePath}</p>} */}
                                    <label htmlFor="postTitle">Enter User Name</label>
                                    <Field
                                        className='form-control'
                                        id='postTitle'
                                        name='postTitle'
                                    />
                                    <ErrorMessage name='postTitle' component="div" className="text-danger" />

                                    <label htmlFor="description">Enter Email</label>
                                    <Field
                                        className='form-control'
                                        id='description'
                                        name='description'
                                    />
                                    <ErrorMessage name='description' component="div" className="text-danger" />
                                    <Button variant="primary" type='submit' className="mt-3">
                                        Update
                                    </Button>
                                </FormikForm>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default UserProfile
