import React, { useState, useEffect } from 'react'
import { LiaEdit } from 'react-icons/lia'
import { MdOutlineDelete } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { deletePost, updatePost } from '../../redux-toolkit/Slice/postSlice'
import { Button, Modal } from 'react-bootstrap'
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { TextareaAutosize, Input } from '@mui/material'
import { addComment, deleteComment, editComment, getComment } from '../../redux-toolkit/Slice/commentSlice'
import user from '../../assets/user.png'
import { addReply, deleteReply, getReply, updateReply } from '../../redux-toolkit/Slice/replySlice'
import { userProfile } from '../../redux-toolkit/Slice/userSlice'
import { toast, ToastContainer } from 'react-toastify'

const PostDetail = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(location, "location")
    const [show, setShow] = useState(false)
    const [post, setPost] = useState(location?.state?.postdata)
    console.log(post, '----------------------------------------------------------------------')
    const [comment, setComment] = useState('')
    const [commentById, setCommentById] = useState([])
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedComment, setEditedComment] = useState('')

    const [reply, setReply] = useState({})
    const [replyData, setReplyData] = useState([])
    const [editReplyId, setEditReplyId] = useState(null)
    const [editedReply, setEditedReply] = useState([])

    const [authUser, setAuthUser] = useState(null)
    const [image, setImage] = useState(null)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const BASE_URL = process.env.REACT_APP_BASE_URL
    // const postModifiedImagePath = post.postImage.replace(/\\/g, '/');

    //---------- formik -----------------
    const initialValues = {
        postTitle: post?.postTitle,
        description: post?.description,
        postImage: post?.onCloudinaryLink
    }

    const schemaValidation = Yup.object({
        postTitle: Yup.string().required("Post title is required"),
        description: Yup.string().required("Description is required")
    })

    //---------- get authorized user --------------
    const authUserData = async () => {
        try {
            const user = await dispatch(userProfile())
            // console.log(user.payload.data.data)
            setAuthUser(user.payload.data.data)
        } catch (error) {
            throw error
        }
    }

    //------------ delete post ----------------
    const handleDeletePost = async (postId) => {
        try {
            const res = await dispatch(deletePost(postId))
            if (res.meta.requestStatus === 'fulfilled') {
                navigate('/dashboard/posts')
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'post is not deleted')
            }
        } catch (error) {
            throw error
        }
    }

    //------------ update post -----------------
    const handleSubmit = async (postData) => {
        console.log(postData, "postData in handleSubmit");
        console.log(post, "========post=======");
        try {
            const formData = new FormData();

            // Append image to FormData
            if (image) {
                formData.append('postImage', image);  // New image selected
            } else {
                formData.append('postImage', post?.onCloudinaryLink);  // Use the existing Cloudinary image link
            }

            // Append other fields
            formData.append('postTitle', postData?.postTitle);
            formData.append('description', postData?.description);

            const res = await dispatch(updatePost({ postId: post?._id, postData: formData }));

            if (res.meta.requestStatus === "fulfilled") {
                // Update the post state with the new data
                setPost({
                    ...post,
                    postTitle: postData?.postTitle,
                    description: postData?.description,
                    postImage: image ? URL.createObjectURL(image) : post?.onCloudinaryLink // Handle the image update in state
                });
                handleClose();
                navigate('/dashboard/posts');
            }

            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'Post is not updated');
            }
        } catch (error) {
            throw error;
        }
    };


    // const handleSubmit = async (postData) => {
    //     console.log(postData, "postData in handleSubmit")
    //     console.log(post, "========post=======")
    //     try {
    //         const formData = new FormData()
    //         if (image) {
    //             formData.append('postImage', image);
    //         } else {
    //             formData.append('postImage', post?.onCloudinaryLink)
    //         }
    //         formData.append('postTitle', postData?.postTitle)
    //         formData.append('description', postData?.description)
    //         // console.log(formData, "--------- form data -------------")               
    //         const res = await dispatch(updatePost({ postId: post?._id, postData: formData }));
    //         if (res.meta.requestStatus === "fulfilled") {
    //             setPost({
    //                 ...post,
    //                 postTitle: postData?.postTitle,
    //                 description: postData?.description,
    //                 postImage: postData?.onCloudinaryLink || post?.onCloudinaryLink
    //             })
    //             handleClose()
    //             navigate('/dashboard/posts')
    //         }
    //         if (res.meta.requestStatus === 'rejected') {
    //             toast.error(res.payload || 'post is not updated')
    //         }
    //     } catch (error) {
    //         throw error
    //     }
    // }

    //------------- add comment --------------------
    const handleAddComment = async () => {
        try {
            // console.log(comment, "comment while add comment")
            const res = await dispatch(addComment({ postId: post?._id, comment }))
            if (res.meta.requestStatus === 'fulfilled') {
                setComment('')
                handleGetComment()
            }
            console.log(res, "resresresres")
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'comment is not added')
            }
        } catch (error) {
            throw error
        }
    }

    //-------------- get comment -----------------
    const handleGetComment = async () => {
        try {
            const res = await dispatch(getComment(post?._id));
            if (res.meta.requestStatus === 'fulfilled') {
                const comments = res.payload.data.data;
                setCommentById(comments);
                // console.log(commentById, "------------=comment=-----------")
                comments.forEach((comment) => {
                    console.log(comment._id, "--------handleGetCOmment------")
                    handleGetReply(comment?._id);
                });
            }
        } catch (error) {
            throw error;
        }
    };

    // ----------------- edit comment----------------------------
    const handleEditComment = (commentId, comment) => {
        setEditingCommentId(commentId);
        setEditedComment(comment);
    };

    const handleUpdatedComment = async (commentId) => {
        try {
            const res = await dispatch(editComment({ commentId, comment: editedComment }));
            if (res.meta.requestStatus === 'fulfilled') {
                handleGetComment();
                setEditingCommentId(null);
                setEditedComment('')
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'comment is not updated')
            }
            // console.log(res, 'response in handle updated comment');
        } catch (error) {
            throw error
        }
    };

    //----------------- delete comment ----------------------------
    const handleDeleteComment = async (id) => {
        try {
            const res = await dispatch(deleteComment(id))
            // console.log(res, "res in handleDeleteComment")
            if (res.meta.requestStatus === 'fulfilled') {
                handleGetComment()
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'comment is not deleted')
            }
        } catch (error) {
            throw error
        }
    }

    //------------------ add reply -------------------------------
    const handleReplyChange = (commentId, value) => {
        setReply(prev => ({ ...prev, [commentId]: value }));
    };

    const handleAddReply = async (commentId, postId) => {
        try {
            const userId = authUser?._id
            const postsId = postId?._id
            const replyText = reply[commentId]
            const res = await dispatch(addReply({ userId, postsId, commentId, replyText }))
            // console.log(res, "res in handleAddReply")
            if (res.meta.requestStatus === 'fulfilled') {
                setReply(prev => ({ ...prev, [commentId]: '' }))
                handleGetReply(commentId)
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'reply is not added')
            }
        } catch (error) {
            throw error
        }
    }

    //------------------ get reply ----------------------------
    const handleGetReply = async (commentId) => {
        // console.log(commentId, "-------------handleGetReply----------")
        try {
            const res = await dispatch(getReply(commentId));
            console.log(res, "res of get reply")
            if (res.meta.requestStatus === 'fulfilled') {
                setReplyData((prevReplyData) => ({
                    ...prevReplyData,
                    [commentId]: res.payload.data,
                }));
            }
            console.log(replyData, "--------- reply data ------")
        } catch (error) {
            throw error;
        }
    };

    //---------------- update reply --------------------
    const handleEditReply = async (replyId, replyData) => {
        setEditReplyId(replyId)
        setEditedReply(replyData)

    }

    const handleUpdateReply = async (commentId, replyId) => {
        try {
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
        } catch (error) {
            throw error
        }
    }

    //------------ delete reply -------------------------
    const handleDeleteReply = async (replyId, commentId) => {
        try {
            const res = await dispatch(deleteReply(replyId))
            // console.log(res, "response in handleDeleteReply")
            if (res.meta.requestStatus === 'fulfilled') {
                handleGetReply(commentId)
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.payload || 'reply is not deleted')
            }
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        handleGetComment()
        authUserData()
    }, [])

    return (
        <>
            <div className='container'>
                <div className='row'>
                    <h1 className="text-center">Post Details</h1>
                    <div className='col-lg-6'>
                        <div className="border border-1 rounded-3 m-3 shadow">
                            {
                                post?.onCloudinaryLink && (
                                    <img src={post?.onCloudinaryLink} className='rounded-top-3 object-fit-cover' alt='post image' />
                                )
                            }
                            <h3 className='text-center'>{post.postTitle}</h3>
                            <h5 className='text-center'>{post.description}</h5>
                            {authUser && authUser?._id === post.userId && (
                                <>
                                    <hr />
                                    <div className='text-center justify-content-center'>
                                        <LiaEdit
                                            className='me-5 mb-2 text-primary'
                                            style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                            onClick={handleShow}
                                        />
                                        <MdOutlineDelete
                                            className='me-5 mb-2 text-danger'
                                            style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                            onClick={() => handleDeletePost(post._id)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='col-lg-6'>
                        <div className='m-3'>
                            <div className='d-flex'>
                                <TextareaAutosize
                                    className='w-100 rounded p-1 mx-2'
                                    placeholder="Add a comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div>
                                    <button className='btn btn-outline-primary me-2' onClick={handleAddComment}>Add</button>
                                </div>
                            </div>
                            {commentById.map((comment) => (
                                <div key={comment._id}>
                                    <div className='p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
                                        <div className='d-flex'>
                                            <img src={user} style={{ width: '40px', maxHeight: '40px' }} alt='User' />
                                            <div className='px-2'>
                                                <h6 className='m-0 p-0'>{comment.userId?.fullName}</h6>
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
                                                        <p className='text-break text-break m-0 p-0'>{comment.comment}</p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {
                                            authUser && authUser._id === comment?.userId?._id && (
                                                <div className='d-flex justify-content-end mt-2'>
                                                    <LiaEdit
                                                        className='mx-2 text-primary'
                                                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                        onClick={() => handleEditComment(comment._id, comment.comment)}
                                                    />
                                                    <MdOutlineDelete
                                                        className='text-danger'
                                                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                        <div className='w-75'>
                                            <div className='d-flex'>
                                                <TextareaAutosize
                                                    className='w-100 rounded p-1 mx-2'
                                                    placeholder="Add a reply"
                                                    value={reply[comment._id] || ''}
                                                    onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                                                // value={reply}
                                                // onChange={(e) => setReply(e.target.value)}
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
                                                                editReplyId === reply._id ? (
                                                                    <div className='d-flex'>
                                                                        <Input
                                                                            value={editedReply}
                                                                            onChange={(e) => setEditedReply(e.target.value)}
                                                                            className='me-3'
                                                                        />
                                                                        <button
                                                                            className='btn btn-sm btn-outline-primary'
                                                                            onClick={() => handleUpdateReply(comment._id, reply._id)}
                                                                        >Update</button>
                                                                    </div>
                                                                ) : (
                                                                    <p className='text-break m-0 p-0'>{reply.commentReply}</p>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        authUser && authUser?._id === reply?.userId?._id && (
                                                            <div className='d-flex justify-content-end mt-2'>
                                                                <LiaEdit
                                                                    className='mx-2 text-primary'
                                                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                                    onClick={() => handleEditReply(reply?._id, reply?.commentReply)}
                                                                />
                                                                <MdOutlineDelete
                                                                    className='text-danger'
                                                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                                    onClick={() => handleDeleteReply(reply?._id, comment?._id)}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            ))}
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
                                        <div className="mb-3">
                                            <img
                                                src={post?.onCloudinaryLink}
                                                alt="Current Post"
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                        </div>

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
                                        {/* {postModifiedImagePath && <p>Current Image: {postModifiedImagePath}</p>} */}
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
                </div >
            </div >
        </>
    )
}

export default PostDetail