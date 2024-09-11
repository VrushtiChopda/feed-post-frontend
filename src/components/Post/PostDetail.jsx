import React, { useState, useEffect } from 'react'
import { LiaEdit } from 'react-icons/lia'
import { MdOutlineDelete } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { deletePost, updatePost } from '../../redux-toolkit/Slice/postSlice'
import { Button, Modal } from 'react-bootstrap'
import { Form, ErrorMessage, Field, Formik } from 'formik'
import * as Yup from 'yup'
import { TextareaAutosize, Input } from '@mui/material'
import { addComment, deleteComment, editComment, getComment } from '../../redux-toolkit/Slice/commentSlice'
import user from '../../assets/user.png'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { addReply, getReply } from '../../redux-toolkit/Slice/replySlice'

const PostDetail = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [show, setShow] = useState(false)
    const [post, setPost] = useState(location.state.postdata)
    const [postId, setPostId] = useState(null)
    const [comment, setComment] = useState('')
    const [commentById, setCommentById] = useState([])
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedComment, setEditedComment] = useState('')

    const [reply, setReply] = useState(null)
    const [replyData, setReplyData] = useState([])
    const token = Cookies.get('token')
    const authorizedUser = jwtDecode(token)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const initialValues = {
        postTitle: post.postTitle,
        description: post.description
    }

    const schemaValidation = Yup.object({
        postTitle: Yup.string().required("Post title is required"),
        description: Yup.string().required("Description is required")
    })

    const handleDeletePost = async (postId) => {
        try {
            const res = await dispatch(deletePost(postId))
            if (res.meta.requestStatus === 'fulfilled') {
                navigate('/dashboard/posts')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (postData) => {
        try {
            const formData = {
                postTitle: postData.postTitle,
                description: postData.description
            }
            const res = await dispatch(updatePost({ postId: post._id, postData: formData }));
            if (res.meta.requestStatus === "fulfilled") {
                setPost(formData)
                handleClose()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddComment = async () => {
        try {
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
            const res = await dispatch(getComment(post._id))
            console.log(res, "handleGetComment")
            setCommentById(res.payload.data.data)
        } catch (error) {
            console.log(error)
        }
    }

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

    const handleAddReply = async (commentId) => {
        // console.log(parentCommentId, "reply")
        const res = await dispatch(addReply(reply))
        console.log(res.data, "res in handleAddReply")
        handleGetReply(commentId)
    }

    const handleGetReply = async () => {
        console.log(comment, "comment")
        const res = await dispatch(getReply(comment._id))
        console.log(res.data, "res in handleGetReply")
        setReplyData(res.data)
        console.log(replyData, "replyData")
    }
    useEffect(() => {
        handleGetComment()
    }, [])

    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                        <div className="border border-1 rounded-3 m-3 shadow ">
                            <h3 className='text-center'>{post.postTitle}</h3>
                            <h5 className='text-center'>{post.description}</h5>
                            {authorizedUser && authorizedUser._id === post.userId && (
                                <>
                                    <hr />
                                    <div className='text-center justify-content-center'>
                                        <LiaEdit
                                            className='me-5 mb-2'
                                            style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                            onClick={handleShow}
                                        />
                                        <MdOutlineDelete
                                            className='me-5 mb-2'
                                            style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                            onClick={() => handleDeletePost(post._id)}
                                        />
                                    </div>
                                </>
                            )}
                            {/* {authorizedUser && authorizedUser._id === post.userId && (
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
                                <div>
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
                                                        <p className='m-0 p-0'>{comment.comment}</p>
                                                    )
                                                }
                                            </div>
                                        </div>

                                        {
                                            authorizedUser && authorizedUser._id === comment.userId._id && (
                                                <div className='d-flex justify-content-end mt-2'>
                                                    <LiaEdit
                                                        className='mx-2'
                                                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                        onClick={() => handleEditComment(comment._id, comment.comment)}
                                                    />
                                                    <MdOutlineDelete
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
                                                        onClick={() => handleAddReply(comment._id)}
                                                    >Add</button>
                                                </div>
                                            </div>
                                            {/* <div className='d-flex'>
                                                <img src={user} style={{ width: '40px', maxHeight: '40px' }} alt='User' />
                                                <div className='px-2'>
                                                    <h6 className='m-0 p-0'>{comment.userId.fullName}</h6>

                                                    {/* {
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
                                                        ) : ( */}
                                            {/* <p className='m-0 p-0'>{replyData}</p> */}
                                            {/* )
                                                    } */}
                                            {/* </div>
                                    </div> */}

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
                                {(formik) => (
                                    <Form>
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
                                    </Form>
                                )}
                            </Formik>
                        </Modal.Body>
                    </Modal>
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
//     const authorizedUser = jwtDecode(token)

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
//                 {authorizedUser && authorizedUser._id === post.userId && (
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
//     const authorizedUser = jwtDecode(token)
//     console.log(authorizedUser, "authorized User")
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
//                     authorizedUser && authorizedUser._id === post.userId ? (
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
