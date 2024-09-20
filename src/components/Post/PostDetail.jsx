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

    const [show, setShow] = useState(false)
    const [post, setPost] = useState(location.state.postdata)

    const [comment, setComment] = useState('')
    const [commentById, setCommentById] = useState([])
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedComment, setEditedComment] = useState('')

    const [reply, setReply] = useState(null)
    const [replyData, setReplyData] = useState([])
    const [editReplyId, setEditReplyId] = useState(null)
    const [editedReply, setEditedReply] = useState([])

    const [authUser, setAuthUser] = useState(null)
    const [image, setImage] = useState(null)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const BASE_URL = process.env.REACT_APP_BASE_URL
    const postModifiedImagePath = post.postImage.replace(/\\/g, '/');

    const initialValues = {
        postTitle: post.postTitle,
        description: post.description,
        postImage: postModifiedImagePath
    }

    const schemaValidation = Yup.object({
        postTitle: Yup.string().required("Post title is required"),
        description: Yup.string().required("Description is required")
    })

    const authUserData = async () => {
        try {
            const user = await dispatch(userProfile())
            console.log(user.payload.data.data)
            setAuthUser(user.payload.data.data)
        } catch (error) {
            throw error
        }
    }

    const handleDeletePost = async (postId) => {
        try {
            const res = await dispatch(deletePost(postId))
            if (res.meta.requestStatus === 'fulfilled') {
                navigate('/dashboard/posts')
            }
            if (res.meta.requestStatus === 'rejected') {
                toast.error(res.error.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (postData) => {
        console.log(postData, "postData in handleSubmit")
        console.log(post.postImage, "===============", postData.postImage)
        try {
            const formData = new FormData()

            if (image) {
                formData.append('postImage', image);

            } else {
                formData.append('postImage', post.postImage)
            }
            formData.append('postTitle', postData.postTitle)
            formData.append('description', postData.description)
            console.log(formData, "--------- form data -------------")
            const res = await dispatch(updatePost({ postId: post._id, postData: formData }));
            if (res.meta.requestStatus === "fulfilled") {
                setPost({
                    ...post,
                    postTitle: postData.postTitle,
                    description: postData.description,
                    postImage: postData.postImage || post.postImage
                })
                handleClose()
                navigate('/dashboard/posts')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddComment = async () => {
        try {
            console.log(comment, "comment while add comment")
            const res = await dispatch(addComment({ postId: post._id, comment }))
            if (res.meta.requestStatus === 'fulfilled') {
                setComment('')
                handleGetComment()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetComment = async () => {
        try {
            const res = await dispatch(getComment(post._id));
            if (res.meta.requestStatus === 'fulfilled') {
                const comments = res.payload.data.data;
                setCommentById(comments);
                console.log(commentById, "------------=comment=-----------")
                comments.forEach((comment) => {
                    handleGetReply(comment._id);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditComment = (commentId, comment) => {
        setEditingCommentId(commentId);
        setEditedComment(comment);
    };

    const handleUpdatedComment = async (commentId) => {
        const res = await dispatch(editComment({ commentId, comment: editedComment }));
        if (res.meta.requestStatus === 'fulfilled') {
            handleGetComment();
            setEditingCommentId(null);
            setEditedComment('')
        }
        console.log(res, 'response in handle updated comment');
    };

    const handleDeleteComment = async (id) => {
        const res = await dispatch(deleteComment(id))
        console.log(res, "res in handleDeleteComment")
        if (res.meta.requestStatus === 'fulfilled') {
            handleGetComment()
        }
    }

    const handleAddReply = async (commentId, postId) => {
        const userId = authUser._id
        const postsId = postId._id
        const res = await dispatch(addReply({ userId, postsId, commentId, reply }))
        console.log(res, "res in handleAddReply")
        if (res.meta.requestStatus === 'fulfilled') {
            setReply(' ')
            handleGetReply(commentId)
        }
    }

    const handleGetReply = async (commentId) => {
        try {
            const res = await dispatch(getReply(commentId));
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

    const handleEditReply = async (replyId, replyData) => {
        setEditReplyId(replyId)
        setEditedReply(replyData)

    }

    const handleUpdateReply = async (commentId, replyId) => {
        console.log(commentId, "------ commentId -----")
        console.log(replyId, "------ replyId ------")
        console.log(editedReply, "editedreply")
        const data = { id: replyId, text: editedReply }
        const res = await dispatch(updateReply(data))
        console.log(res, "response in handleUpdateReply")
        if (res.meta.requestStatus === 'fulfilled') {
            setEditedReply('')
            setEditReplyId(null)
            handleGetReply(commentId)
        }
    }

    const handleDeleteReply = async (replyId, commentId) => {
        const res = await dispatch(deleteReply(replyId))
        console.log(res, "response in handleDeleteReply")
        if (res.meta.requestStatus === 'fulfilled') {
            handleGetReply(commentId)
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
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                        <div className="border border-1 rounded-3 m-3 shadow ">
                            {
                                post?.postImage && (
                                    <img src={`${BASE_URL}/${postModifiedImagePath}`} className='object-fit-cover' alt='post image' />
                                )
                            }
                            <h3 className='text-center'>{post.postTitle}</h3>
                            <h5 className='text-center'>{post.description}</h5>
                            {authUser && authUser._id === post.userId && (
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
                            {/* {authUser && authUser._id === post.userId && (
                                <>
                                    <hr />
                                    <div className='text-center justify-content-center'>
                                        <LiaEdit
                                            className='me-5 mb-2'
                                            style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                            onClick={() => handleEditPost(post._id, post)}
                                        />
                                        <MdOutlineDelete
                                            className='me-5 mb-2'
                                            style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                            onClick={() => handleDeletePost(post._id)}
                                        />
                                    </div>
                                </>
                            )} */}
                        </div>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
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
                                                    value={reply}
                                                    onChange={(e) => setReply(e.target.value)}
                                                />
                                                <div>
                                                    <button
                                                        className='btn btn-outline-primary me-2'
                                                        onClick={() => handleAddReply(comment._id, comment.postId)}
                                                    >Add</button>
                                                </div>
                                            </div>
                                            {replyData[comment._id] && replyData[comment._id]?.map((reply) => (
                                                <div key={reply._id} className='p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
                                                    <div className='d-flex'>
                                                        <img src={user} style={{ width: '30px', maxHeight: '30px' }} alt='User' />
                                                        <div className='px-2'>
                                                            <h6 className='m-0 p-0'>{reply.userId.fullName}</h6>
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
                                                        authUser && authUser._id === reply.userId._id && (
                                                            <div className='d-flex justify-content-end mt-2'>
                                                                <LiaEdit
                                                                    className='mx-2 text-primary'
                                                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                                    onClick={() => handleEditReply(reply._id, reply.commentReply)}
                                                                />
                                                                <MdOutlineDelete
                                                                    className='text-danger'
                                                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                                    onClick={() => handleDeleteReply(reply._id, comment._id)}
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
                </div >
            </div >
        </>
    )
}

export default PostDetail


// import React, { useState } from 'react'
// import { FaRegCommentDots } from 'react-icons/fa'
// import { LiaEdit } from 'react-icons/lia'
// import { MdOutlineDelete } from 'react-icons/md'
// import { useDispatch } from 'react-redux'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { deletePost, updatePost } from '../../redux-toolkit/Slice/postSlice'
// import { Button, Modal } from 'react-bootstrap'
// import { Form, ErrorMessage, Field, Formik } from 'formik'
// import * as Yup from 'yup'
// import { Input, TextareaAutosize } from '@mui/material'
// import { addComment, editComment, getComment } from '../../redux-toolkit/Slice/commentSlice'
// import user from '../../assets/user.png'
// import { jwtDecode } from 'jwt-decode'
// import Cookies from 'js-cookie'

// const PostDetail = () => {
//     const location = useLocation()
//     const [show, setShow] = useState(false);
//     const [post, setPost] = useState(location.state.postdata)
//     const [comment, setComment] = useState('')
//     const [commentById, setCommentById] = useState([])
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const [openComments, setOpenComments] = useState({});
//     const [editingCommentId, setEditingCommentId] = useState(null); // For tracking which comment is being edited
//     const [editedComment, setEditedComment] = useState(''); // To store the edited comment text

//     const token = Cookies.get('token')
//     const authUser = jwtDecode(token)

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);

//     const initialValues = {
//         postTitle: post.postTitle,
//         description: post.description
//     }

//     const schemaValidation = Yup.object({
//         postTitle: Yup.string().required("Post title is required"),
//         description: Yup.string().required("Description is required")
//     })

//     const handleDeletePost = async (postId) => {
//         try {
//             const res = await dispatch(deletePost(postId))
//             if (res.meta.requestStatus === 'fulfilled') {
//                 navigate('/dashboard/posts')
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleSubmit = async (postData) => {
//         try {
//             const formData = {
//                 postTitle: postData.postTitle,
//                 description: postData.description
//             }
//             const res = await dispatch(updatePost({ postId: post._id, postData: formData }));
//             if (res.meta.requestStatus === "fulfilled") {
//                 setPost(formData)
//                 handleClose()
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleAddComment = async () => {
//         try {
//             const res = await dispatch(addComment({ postId: post._id, comment }))
//             if (res.meta.requestStatus === 'fulfilled') {
//                 setComment('')
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleGetComment = async () => {
//         try {
//             const res = await dispatch(getComment(post._id))
//             setCommentById(res.payload.data.data)
//         } catch (error) {
//             console.log(error)
//         }
//     }

// const handleEditComment = (commentId, comment) => {
//     setEditingCommentId(commentId); // Set the comment id being edited
//     setEditedComment(comment); // Prepopulate the input with the existing comment text\
// }

// const handleUpdatedComment = async (commentId, comment) => {
//     console.log(commentId, "commentId")
//     const res = await dispatch(editComment(commentId, comment))
//     console.log(res, "response in handle updated comment")
// }

// const handleToggle = (id) => {
//     setOpenComments((prevState) => ({
//         ...prevState,
//         [id]: !prevState[id]
//     }));
// };

//     return (
//         <>
//             <div className="col-lg-3 border border-1 rounded-3 m-3 shadow">
//                 <h3 className='text-center'>{post.postTitle}</h3>
//                 <h5 className='text-center'>{post.description}</h5>
//                 {authUser && authUser._id === post.userId && (
//                     <>
//                         <hr />
//                         <div className='text-center justify-content-center'>
//                             <LiaEdit
//                                 className='me-5 mb-2'
//                                 style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                 onClick={handleShow}
//                             />
//                             <MdOutlineDelete
//                                 className='me-5 mb-2'
//                                 style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                 onClick={() => handleDeletePost(post._id)}
//                             />
//                         </div>
//                     </>
//                 )}
//             </div>
//             <div className='col-lg-3 m-3'>
//                 <TextareaAutosize
//                     className='w-100 rounded p-1'
//                     placeholder="Add a comment"
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                 />
//                 <div>
//                     <button className='btn btn-outline-primary me-2' onClick={handleAddComment}>Add</button>
//                     <button className='btn btn-outline-primary' onClick={handleGetComment}>View all comments</button>
//                 </div>
//                 {commentById.map((comment) => (
//                     <div key={comment._id} className='w-75 p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
//                         <div className='d-flex' onClick={() => handleToggle(comment._id)}>
//                             <img src={user} style={{ width: '40px', maxHeight: '40px' }} alt='User' />
//                             <div className='px-2'>
//                                 <h6 className='m-0 p-0'>{comment.userId.fullName}</h6>

//                                 {/* Conditional rendering: show input field if the comment is being edited */}
//                                 {editingCommentId === comment._id ? (
//                                     <div className='d-flex'>
//                                         <Input
//                                             value={editedComment}
//                                             onChange={(e) => setEditedComment(e.target.value)}
//                                             className='me-3'
//                                         />
//                                         <button
//                                             className='btn btn-sm btn-outline-primary'
//                                             onClick={() => handleUpdatedComment(comment._id, comment)}
//                                         >update</button>
//                                     </div>
//                                 ) : (
//                                     <p className='m-0 p-0'>{comment.comment}</p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Show edit/delete buttons when a comment is clicked */}
//                         {openComments[comment._id] && (
//                             <div className='d-flex justify-content-end mt-2'>
//                                 <LiaEdit
//                                     className='mx-2'
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                     onClick={() => handleEditComment(comment._id, comment.comment)}
//                                 />
//                                 <MdOutlineDelete
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {/* Modal for updating post */}
//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Update post</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Formik
//                         initialValues={initialValues}
//                         validationSchema={schemaValidation}
//                         onSubmit={handleSubmit}
//                     >
//                         {(formik) => (
//                             <Form>
//                                 <label htmlFor="postTitle">Enter Post Title</label>
//                                 <Field
//                                     className='form-control'
//                                     id='postTitle'
//                                     name='postTitle'
//                                 />
//                                 <ErrorMessage name='postTitle' component="div" className="text-danger" />
//                                 <label htmlFor="description">Enter Post Description</label>
//                                 <Field
//                                     className='form-control'
//                                     id='description'
//                                     name='description'
//                                 />
//                                 <ErrorMessage name='description' component="div" className="text-danger" />

//                                 <Button variant="primary" type='submit' className="mt-3">
//                                     Update
//                                 </Button>
//                             </Form>
//                         )}
//                     </Formik>
//                 </Modal.Body>
//             </Modal>
//         </>
//     )
// }

// export default PostDetail



// import React, { useState } from 'react'
// import { FaRegCommentDots } from 'react-icons/fa'
// import { LiaEdit } from 'react-icons/lia'
// import { MdOutlineDelete } from 'react-icons/md'
// import { useDispatch } from 'react-redux'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { deletePost, updatePost } from '../../redux-toolkit/Slice/postSlice'
// import { Button, Modal } from 'react-bootstrap'
// import { Form, ErrorMessage, Field, Formik } from 'formik'
// import * as Yup from 'yup'
// import { Input, TextareaAutosize } from '@mui/material'
// import { addComment, getComment } from '../../redux-toolkit/Slice/commentSlice'
// import user from '../../assets/user.png'
// import { jwtDecode } from 'jwt-decode'
// import Cookies from 'js-cookie'
// const PostDetail = () => {
//     const location = useLocation()
//     const [show, setShow] = useState(false);
//     const [post, setPost] = useState(location.state.postdata)
//     const [comment, setComment] = useState('')
//     const [commentById, setCommentById] = useState([])
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const [openComments, setOpenComments] = useState({});

//     const [edit, setEdit] = useState(false)

//     // Toggle the visibility of edit/delete options for a specific comment
//     const handleToggle = (id) => {
//         setOpenComments((prevState) => ({
//             ...prevState,
//             [id]: !prevState[id] // Toggle the current state of the clicked comment
//         }));
//     };

//     const token = Cookies.get('token')
//     const authUser = jwtDecode(token)
//     console.log(authUser, "authorized User")
//     // model
//     const handleClose = () => {
//         setShow(false)
//     };
//     const handleShow = () => {
//         setShow(true)
//     };

//     // formik form
//     const initialValues = {
//         postTitle: post.postTitle,
//         description: post.description
//     }

//     const schemaValidation = Yup.object({
//         postTitle: Yup.string().required("postTitle is required"),
//         description: Yup.string().required("description is required")
//     })

//     //---------- delete post -------------
//     const handleDeletePost = async (postId) => {
//         try {
//             const res = await dispatch(deletePost(postId))
//             if (res.meta.requestStatus === 'fulfilled') {
//                 navigate('/dashboard/posts')
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleSubmit = async (postData) => {
//         console.log(postData, "postData in handleSubmit")
//         try {
//             const formData = {
//                 postTitle: postData.postTitle,
//                 description: postData.description
//             }
//             console.log(formData, "Form Data")
//             const res = await dispatch(updatePost({ postId: post._id, postData: formData }));
//             console.log(res, " response of update")
//             if (res.meta.requestStatus === "fulfilled") {
//                 setPost(formData)
//                 handleClose()
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     //------------ ADD COMMENT ------------

//     const handleAddComment = async () => {
//         try {
//             console.log(comment)
//             const res = await dispatch(addComment({ postId: post._id, comment: comment }))
//             console.log(res, "res")
//             if (res.meta.requestStatus === 'fulfilled') {
//                 setComment('')
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleGetComment = async () => {
//         try {
//             const res = await dispatch(getComment(post._id))
//             console.log(res.payload.data.data, "response of handleGetComment")
//             setCommentById(res.payload.data.data)

//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleEditComment = async () => {
//         try {
//             setEdit(true)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     return (
//         <>
//             <div className="col-lg-3 border border-1 rounded-3 m-3 shadow">
//                 <h3 className='text-center'>{post.postTitle}</h3>
//                 <h5 className='text-center'>{post.description}</h5>
//                 {
//                     authUser && authUser._id === post.userId ? (
//                         <>
//                             <hr />
//                             <div className='text-center justify-content-center'>
//                                 <LiaEdit
//                                     className='me-5 mb-2'
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                     onClick={handleShow}
//                                 />
//                                 <MdOutlineDelete
//                                     className='me-5 mb-2'
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                     onClick={() => handleDeletePost(post._id)}
//                                 />
//                             </div>
//                         </>
//                     ) : ''
//                 }
//             </div>
//             <div className='col-lg-3 m-3'>
//                 <TextareaAutosize
//                     className='w-100 rounded p-1'
//                     placeholder="Add a comment"
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                 />
//                 <div>
//                     <button className='btn btn-outline-primary me-2' onClick={handleAddComment}>Add</button>
//                     <button className='btn btn-outline-primary' onClick={handleGetComment}>View all comment</button>
//                 </div>
//                 {commentById && commentById.map((comment) => (
//                     <div key={comment._id} className='w-75 p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
//                         <div className='d-flex' onClick={() => handleToggle(comment._id)}>
//                             <img src={user} style={{ width: '40px', maxHeight: '40px' }} alt='User' />
//                             <div className='px-2'>
//                                 <h6 className='m-0 p-0'>{comment.userId.fullName}</h6>
//                                 {
//                                     edit && edit === true ? (
//                                         <Input />
//                                     ) : <p className='m-0 p-0'> {comment.comment}</p>
//                                 }

//                             </div>
//                         </div>

//                         {/* Conditional rendering based on the clicked comment */}
//                         {openComments[comment._id] && (
//                             <div className='d-flex justify-content-end mt-2'>
//                                 <LiaEdit
//                                     className='mx-2'
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                     onClick={() => handleEditComment(comment._id)}
//                                 />
//                                 <MdOutlineDelete
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 ))}
//                 {/* {
//                     commentById && commentById.map((comment) => (
//                         <>
//                             <div className='w-75 p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'  >
//                                 <div className=' d-flex'>
//                                     <img src={user} style={{ width: '40px', maxHeight: '40px' }} />
//                                     <div className='px-2'>
//                                         <h6 className='m-0 p-0'>{comment.userId.fullName}</h6>
//                                         <p className='m-0 p-0'> {comment.comment}</p>
//                                     </div>
//                                 </div>
//                                 {/* <div className='d-flex justify-content-end '>
//                                     <Input className='me-2' placeholder='add a reply' />
//                                     <button className='btn btn-sm btn-outline-primary'>Add</button>
//                                 </div> */}
//                 {/* </div>
//                         </>
//                     ))
//                 } */}
//             </div>

//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>update post</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Formik
//                         initialValues={initialValues}
//                         validationSchema={schemaValidation}
//                         onSubmit={handleSubmit}
//                     >
//                         {(formik) => (
//                             <Form>
//                                 <label htmlFor="postTitle">Enter Post Title</label>
//                                 <Field
//                                     className='form-control'
//                                     id='postTitle'
//                                     name='postTitle'
//                                 />
//                                 <ErrorMessage name='postTitle' component="div" className="text-danger" />
//                                 <label htmlFor="description">Enter Post Description</label>
//                                 <Field
//                                     className='form-control'
//                                     id='description'
//                                     name='description'
//                                 />
//                                 <ErrorMessage name='description' component="div" className="text-danger" />

//                                 <Button variant="primary" type='submit' className="mt-3">
//                                     Update
//                                 </Button>
//                             </Form>
//                         )}
//                     </Formik>
//                 </Modal.Body>
//             </Modal >
//         </>
//     )
// }

// export default PostDetail
