import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { userProfile } from '../../redux-toolkit/Slice/userSlice';
import { LiaEdit } from 'react-icons/lia';
import { MdOutlineDelete } from 'react-icons/md';
import { deletePost, updatePost } from '../../redux-toolkit/Slice/postSlice';
import { getPostByUserId } from '../../redux-toolkit/Slice/userPostSlice';
import { addComment, deleteCommentByAuthorizedUser, editComment, getComment } from '../../redux-toolkit/Slice/commentSlice';
import { addReply, deleteReply, deleteReplyByAuthorizedUser, getReply, updateReply } from '../../redux-toolkit/Slice/replySlice';
import { Input, TextareaAutosize } from '@mui/material';
import * as Yup from 'yup'
import user from '../../assets/user.png'
import { Button, Modal } from 'react-bootstrap';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik'
import { toast, ToastContainer } from 'react-toastify';

const UserPostDetails = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [edit, setEdit] = useState(false)
    const [updateValue, setUpdateValue] = useState(null)
    const [show, setShow] = useState(false)
    const [premiumPostId, setPostId] = useState(null)

    const [posts, setPosts] = useState(location.state.postData)
    const [commentsByPostId, setCommentsByPostId] = useState({})
    const [comments, setComments] = useState({})
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedComment, setEditedComment] = useState('')

    const [replies, setReplies] = useState({})
    const [replyData, setReplyData] = useState([])
    const [editReplyId, setEditReplyId] = useState(null)
    const [editedReply, setEditedReply] = useState([])
    const [authUser, setAuthUser] = useState(null)
    const [image, setImage] = useState(null)

    const BASE_URL = process.env.REACT_APP_BASE_URL
    const handleClose = () => setShow(false)
    // const handleShow = () => {
    //     setShow(true)
    // }
    const postModifiedImagePath = posts.postImage.replace(/\\/g, '/');

    const initialValues = {
        postTitle: posts.postTitle,
        description: posts.description
    }

    const schemaValidation = Yup.object({
        postTitle: Yup.string().required("Post title is required"),
        description: Yup.string().required("Description is required")
    })

    useEffect(() => {
        getAllPosts()
        authUserData()
    }, [])

    //------------- authorized user ------------
    const authUserData = async () => {
        try {
            const user = await dispatch(userProfile())
            // console.log(user.payload.data.data)
            setAuthUser(user.payload.data.data)
        } catch (error) {
            throw error
        }
    }

    //------------ get all post with comments ------------------
    const getAllPosts = async () => {
        const res = await dispatch(getPostByUserId())
        // setPosts(res?.payload?.data?.data)
        res?.payload?.data?.data?.forEach(post => {
            handleGetComment(post._id)
        })
    }
    // ----------- update post ----------------
    const handleEditPost = (postId, post) => {
        setShow(true)
        setEdit(true)
        setPostId(postId)
        setUpdateValue(post)
    }

    const handleSubmit = async (postData) => {
        try {
            const formData = new FormData()
            if (image) {
                formData.append('postImage', image);
            }
            formData.append('postTitle', postData.postTitle)
            formData.append('description', postData.description)
            const res = await dispatch(updatePost({ postId: posts._id, postData: formData }));
            if (res.meta.requestStatus === "fulfilled") {
                setPosts({
                    ...posts,
                    postTitle: postData.postTitle,
                    description: postData.description,
                    postImage: postData.onCloudinaryLink
                })
                handleClose()
                navigate('/dashboard/userpost')
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'post is not updated')
            }
        } catch (error) {
            console.log(error)
        }
    }
    //---------- delete post --------------
    const handleDeletePost = async (postId) => {
        const res = await dispatch(deletePost(postId))
        // console.log(res, "----- handleDeletePost response --------")
        if (res.meta.requestStatus === 'fulfilled') {
            navigate('/dashboard/userpost')
        }
        if (res.meta.requestStatus === 'rejected') {
            toast.error(res.payload || 'post is not deleted')
        }
    }

    //---------- get comment ---------------
    const handleGetComment = async (postId) => {
        const res = await dispatch(getComment(postId))
        // console.log(res.payload.data.data, "payload of get comment")
        if (res?.payload?.data?.data) {
            setCommentsByPostId((prev) => ({
                ...prev,
                [postId]: res.payload.data.data
            }))
            res.payload.data.data.forEach(comment => {
                handleGetReply(comment._id)
            })
        }
    }

    //---------- add comment ----------------
    const handleCommentChange = (postId, value) => {
        setComments(prev => ({
            ...prev,
            [postId]: value
        }))
    }

    const handleAddComment = async (postId) => {
        try {
            const comment = comments[postId] || ''
            const res = await dispatch(addComment({ postId: postId, comment: comment }))
            if (res.meta.requestStatus === 'fulfilled') {
                setComments(prev => ({
                    ...prev,
                    [postId]: ''
                }))
                handleGetComment(postId)
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'comment is not added')
            }
        } catch (error) {
            console.log(error)
        }
    }

    //--------- update comment ---------------
    const handleEditComment = (commentId, comment) => {
        setEditingCommentId(commentId);
        setEditedComment(comment);
    };

    const handleUpdatedComment = async (commentId) => {
        const res = await dispatch(editComment({ commentId: commentId, comment: editedComment }));
        if (res.meta.requestStatus === 'fulfilled') {
            handleGetComment(res.payload.data.postId);
            setEditingCommentId(null);
            setEditedComment('')
        }
        if (res.meta.requestStatus === 'rejected') {
            toast.error(res.payload || 'comment is noy updated')
        }
        // console.log(res, 'response in handle updated comment');
    };
    // --------- delete comment---------------
    const handleDeleteComment = async (commentId, postId) => {
        const res = await dispatch(deleteCommentByAuthorizedUser(commentId))
        // console.log(res, "res of handleDeleteComment")
        if (res.meta.requestStatus === 'fulfilled') {
            handleGetComment(postId)
        }
        if (res.meta.requestStatus === 'rejected') {
            toast.error(res.payload || 'comment not deleted')
        }
    }

    //------------- add reply ----------------
    const handleReplyChange = (commentId, value) => {
        setReplies(prevReplies => ({
            ...prevReplies,
            [commentId]: value
        }))
    }
    const handleAddReply = async (commentId, postId) => {
        const userId = authUser._id
        const postsId = postId._id
        const replyText = replies[commentId]
        const res = await dispatch(addReply({ userId, postsId, commentId, replyText }))
        // console.log(res, "res in handleAddReply")
        if (res.meta.requestStatus === 'fulfilled') {
            setReplies(prevReplies => ({
                ...prevReplies,
                [commentId]: ''
            }))
            handleGetReply(commentId)
        }
        if (res.meta.requestStatus === 'rejected') {
            toast.error(res.payload || 'reply is not added')
        }
    }

    //------------- get reply ------------------
    const handleGetReply = async (commentId) => {
        // console.log(commentId, "------commentID in handleGetReply-------")
        try {
            const res = await dispatch(getReply(commentId));
            // console.log(res, "=======res in handleGetReply=========")
            if (res.meta.requestStatus === 'fulfilled') {
                setReplyData((prevReplyData) => ({
                    ...prevReplyData,
                    [commentId]: res.payload.data,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //------------- edit reply ---------------
    const handleEditReply = async (replyId, replyData) => {
        setEditReplyId(replyId)
        setEditedReply(replyData)

    }

    const handleUpdateReply = async (commentId, replyId) => {
        const data = { id: replyId, text: editedReply }
        const res = await dispatch(updateReply(data))
        // console.log(res, "response in handleUpdateReply")
        if (res.meta.requestStatus === 'fulfilled') {
            setEditedReply('')
            setEditReplyId(null)
            handleGetReply(commentId)
        }
        if (res.meta.requestStatus === 'rejected') {
            toast.error(res.payload || 'reply is not updated')
        }
    }

    // //------------ delete reply ----------------------
    // const handleDeleteReply = async (replyId, commentId) => {
    //     const res = await dispatch(deleteReply(replyId))
    //     // console.log(res, "response in handleDeleteReply")
    //     if (res.meta.requestStatus === 'fulfilled') {
    //         handleGetReply(commentId)
    //     }
    // }

    //------------- delete Reply By Auth user ----------
    const handleDeleteReplyByAuthUser = async (replyId, commentId) => {
        const res = await dispatch(deleteReplyByAuthorizedUser(replyId))
        console.log(res, "response in handleDeleteReply")
        if (res.meta.requestStatus === 'fulfilled') {
            handleGetReply(commentId)
        }
        if (res.meta.requestStatus === 'rejected') {
            toast.error(res.payload || 'reply is not deleted')
        }
    }

    return (
        <>
            <h1 className='text-center'>My post</h1>
            <div className="container">
                <div className="row">
                    <div key={posts._id} className='col-lg-6'>
                        <div className=" border border-1 rounded-3 m-3 shadow">
                            {
                                posts?.onCloudinaryLink && (
                                    <img src={posts?.onCloudinaryLink} alt='post image' className='rounded-top-3' />
                                )
                            }
                            <h3 className='text-center'>{posts?.postTitle}</h3>
                            <h5 className='text-center'>{posts?.description}</h5>
                            <hr />
                            <div className='text-center'>
                                <LiaEdit
                                    className='me-5 mb-2 text-primary'
                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                    onClick={() => handleEditPost(posts._id, posts)}
                                />
                                <MdOutlineDelete
                                    className='me-5 mb-2 text-danger'
                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                    onClick={() => handleDeletePost(posts._id)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6'>
                        <div className='m-3'>
                            <div className='d-flex'>
                                <TextareaAutosize
                                    className='w-100 rounded p-1 mx-2'
                                    placeholder="Add a comment"
                                    value={comments[posts._id] || ''}
                                    onChange={(e) => handleCommentChange(posts._id, e.target.value)}
                                />
                                <div>
                                    <button
                                        className='btn btn-outline-primary me-2'
                                        onClick={() => handleAddComment(posts._id)}
                                    >Add</button>
                                </div>
                            </div>
                            {commentsByPostId[posts._id]?.map((comment) => (
                                <>
                                    <div key={comment._id} className='p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
                                        <div className='d-flex'>
                                            <img src={user} style={{ width: '40px', maxHeight: '40px' }} alt='User' />
                                            <div className='px-2'>
                                                <h6 className='m-0 p-0'>{comment.userId.fullName}</h6>
                                                {
                                                    editingCommentId === comment._id ? (
                                                        <div className='d-flex'>
                                                            <Input
                                                                value={editedComment}
                                                                onChange={(e) => setEditedComment(e.target.value)}
                                                                className='me-3'
                                                            />
                                                            <button
                                                                className='btn btn-sm btn-outline-primary'
                                                                onClick={() => handleUpdatedComment(comment._id)}
                                                            >Update</button>
                                                        </div>
                                                    ) : (
                                                        <p className='text-break m-0 p-0'>{comment.comment}</p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-end mt-2'>
                                            {
                                                authUser && authUser._id === comment.userId._id && (

                                                    <LiaEdit
                                                        className='mx-2 text-primary'
                                                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                        onClick={() => handleEditComment(comment._id, comment.comment)}
                                                    />

                                                )
                                            }
                                            < MdOutlineDelete
                                                className='text-danger'
                                                style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                onClick={() => { handleDeleteComment(comment._id, posts._id) }}
                                            />
                                        </div>
                                    </div>

                                    <div className='d-flex justify-content-end'>
                                        <div className='w-75'>
                                            <div className='d-flex'>
                                                <TextareaAutosize
                                                    className='w-100 rounded p-1 mx-2'
                                                    placeholder="Add a reply"
                                                    value={replies[comment._id] || ''}
                                                    onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                                                />
                                                <div>
                                                    <button
                                                        className='btn btn-outline-primary me-2'
                                                        onClick={() => handleAddReply(comment._id, comment.postId)}
                                                    >Add</button>
                                                </div>
                                            </div>
                                            {replyData[comment?._id] && replyData[comment?._id]?.map((reply) => (
                                                <div key={reply?._id} className='p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
                                                    <div className='d-flex'>
                                                        <img src={user} style={{ width: '30px', maxHeight: '30px' }} alt='User' />
                                                        <div className='px-2'>
                                                            <h6 className='m-0 p-0'>{reply?.userId?.fullName}</h6>
                                                            {
                                                                editReplyId === reply?._id ? (
                                                                    <div className='d-flex'>
                                                                        <Input
                                                                            value={editedReply}
                                                                            onChange={(e) => setEditedReply(e.target.value)}
                                                                            className='me-3'
                                                                        />
                                                                        <button
                                                                            className='btn btn-sm btn-outline-primary'
                                                                            onClick={() => handleUpdateReply(comment?._id, reply?._id)}
                                                                        >Update</button>
                                                                    </div>
                                                                ) : (
                                                                    <p className='text-break m-0 p-0'>{reply?.commentReply}</p>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-end mt-2'>
                                                        {
                                                            authUser && authUser?._id === reply?.userId?._id && (

                                                                <LiaEdit
                                                                    className='mx-2 text-primary'
                                                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                                    onClick={() => handleEditReply(reply?._id, reply?.commentReply)}
                                                                />

                                                            )
                                                        }
                                                        < MdOutlineDelete
                                                            className='text-danger'
                                                            style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                            onClick={() => handleDeleteReplyByAuthUser(reply?._id, comment?._id)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </>
                            ))}
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
                        initialValues={initialValues}
                        validationSchema={schemaValidation}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue }) => (
                            <FormikForm>
                                {postModifiedImagePath && (
                                    <div className="mb-3">
                                        <img
                                            src={`${BASE_URL}/${postModifiedImagePath}`}
                                            alt="Current Post"
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    </div>
                                )}
                                <label htmlFor="postImage">Upload Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="postImage"
                                    name='postImage'
                                    onChange={(e) => {
                                        setFieldValue("postImage", e.target.files[0])
                                        setImage(e.target.files[0])
                                    }}
                                />
                                <label htmlFor="postTitle">Enter Post Title</label>
                                <Field
                                    className='form-control'
                                    id='postTitle'
                                    name='postTitle'
                                />
                                <ErrorMessage name='postTitle' component="div" className="text-danger" />
                                <label htmlFor="description">Enter Post Description</label>
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
        </>
    )
}

export default UserPostDetails
