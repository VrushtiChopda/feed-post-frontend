import React, { useEffect, useState } from 'react'
import { getPostByUserId } from '../../redux-toolkit/Slice/userPostSlice'
import { useDispatch } from 'react-redux'
import { deletePost } from '../../redux-toolkit/Slice/postSlice'
import { LiaEdit } from 'react-icons/lia'
import { MdOutlineDelete } from 'react-icons/md'
import PostForm from './PostForm'
import { Input, TextareaAutosize } from '@mui/material'
import user from '../../assets/user.png'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { addComment, deleteCommentByAuthorizedUser, editComment, getComment } from '../../redux-toolkit/Slice/commentSlice'

const UserPost = () => {
    const [posts, setPosts] = useState([])
    const dispatch = useDispatch()
    const [edit, setEdit] = useState(false)
    const [updateValue, setUpdateValue] = useState(null)
    const [show, setShow] = useState(false)
    const [premiumPostId, setPostId] = useState(null)

    const [commentsByPostId, setCommentsByPostId] = useState({})
    const [comments, setComments] = useState({})
    const [commentById, setCommentById] = useState([])
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedComment, setEditedComment] = useState('')
    const [commentByPostId, setCommentByPostId] = useState({})

    const token = Cookies.get('token')
    const authorizedUser = jwtDecode(token)

    const handleShow = () => {
        setShow(true)
    }

    useEffect(() => {
        getAllPosts()
    }, [dispatch])

    //------------ get all post with comments ------------------
    const getAllPosts = async () => {
        const res = await dispatch(getPostByUserId())
        setPosts(res.payload.data.data)
        res.payload.data.data.forEach(post => {
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

    //---------- delete post --------------
    const handleDeletePost = async (postId) => {
        const res = await dispatch(deletePost(postId))
        if (res.meta.requestStatus === 'fulfilled') {
            getAllPosts()
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
        console.log(res, 'response in handle updated comment');
    };
    // --------- delete comment---------------
    const handleDeleteComment = async (commentId, postId) => {
        const res = await dispatch(deleteCommentByAuthorizedUser(commentId))
        console.log(res, "res of handleDeleteComment")
        if (res.meta.requestStatus === 'fulfilled') {
            handleGetComment(postId)
        }
    }
    return (
        <>
            <h1 className='text-center'>My post</h1>
            <div className="container">
                <div className='mt-3'>
                    <button className='btn btn-outline-dark' onClick={handleShow} > + ADD POST</button>
                </div>
                {posts && posts.map((post) => (
                    <div className="row">
                        <div key={post._id} className='col-lg-6 col-md-6 col-sm-12'>
                            <div className="border border-1 rounded-3 m-3 shadow">
                                <h3 className='text-center'>{post.postTitle}</h3>
                                <h5 className='text-center'>{post.description}</h5>
                                <hr />
                                <div className='text-center'>
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
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className='m-3'>
                                <div className='d-flex'>
                                    <TextareaAutosize
                                        className='w-100 rounded p-1 mx-2'
                                        placeholder="Add a comment"
                                        value={comments[post._id] || ''}
                                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                    />
                                    <div>
                                        <button
                                            className='btn btn-outline-primary me-2'
                                            onClick={() => handleAddComment(post._id)}
                                        >Add</button>
                                    </div>
                                </div>
                                {commentsByPostId[post._id]?.map((comment) => (
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
                                        <div className='d-flex justify-content-end mt-2'>
                                            {
                                                authorizedUser && authorizedUser._id === comment.userId._id && (
                                                    <LiaEdit
                                                        className='mx-2'
                                                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                        onClick={() => handleEditComment(comment._id, comment.comment)}
                                                    />
                                                )
                                            }
                                            <MdOutlineDelete
                                                style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                                onClick={() => { handleDeleteComment(comment._id, post._id) }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <PostForm
                edit={edit}
                show={show}
                setShow={setShow}
                updateValue={updateValue}
                premiumPostId={premiumPostId}
                setEdit={setEdit}
                getAllPost={getAllPosts}
            />
        </>
    )
}

export default UserPost



// import React, { useEffect, useState } from 'react'
// import { getPostByUserId } from '../../redux-toolkit/Slice/userPostSlice'
// import { useDispatch } from 'react-redux'
// import { deletePost } from '../../redux-toolkit/Slice/postSlice'
// import { LiaEdit } from 'react-icons/lia'
// import { MdOutlineDelete } from 'react-icons/md'
// import PostForm from './PostForm'
// import { Input, TextareaAutosize } from '@mui/material'
// import user from '../../assets/user.png'
// import Cookies from 'js-cookie'
// import { jwtDecode } from 'jwt-decode'
// import { addComment, getComment } from '../../redux-toolkit/Slice/commentSlice'

// const UserPost = () => {
//     const [post, setPost] = useState([])
//     const dispatch = useDispatch()
//     const [edit, setEdit] = useState(false)
//     const [updateValue, setUpdateValue] = useState(null)
//     const [show, setShow] = useState(false)
//     const [premiumPostId, setPostId] = useState(null)

//     const [comments, setComments] = useState({})  // Track comments per post
//     const [commentById, setCommentById] = useState([])
//     const [editingCommentId, setEditingCommentId] = useState(null)
//     const [editedComment, setEditedComment] = useState('')
//     const [commentByPostId, setCommentByPostId] = useState({})

//     const token = Cookies.get('token')
//     const authorizedUser = jwtDecode(token)

//     const handleShow = () => {
//         setShow(true)
//     }

//     useEffect(() => {
//         getAllPost()
//         handleGetComment()
//     }, [dispatch])

//     const getAllPost = async () => {
//         const res = await dispatch(getPostByUserId())
//         console.log(res.payload.data.data, "res of getUserPost")
//         setPost(res.payload.data.data)
//     }

//     const handleEditPost = async (postId, post) => {
//         setShow(true)
//         setEdit(true)
//         setPostId(postId)
//         setUpdateValue(post)
//     }

//     const handleDeletePost = async (postId) => {
//         const res = await dispatch(deletePost(postId))
//         console.log(res)
//         if (res.meta.requestStatus === 'fulfilled') {
//             getAllPost()
//         }
//     }

//     const handleGetComment = async (postId) => {
//         console.log(postId, "postId")
//         const res = await dispatch(getComment(postId))
//         setCommentByPostId((prev) => ({
//             ...prev,
//             [postId]: res.payload.data
//         }))
//         console.log(res)
//     }

//     // const handleCommentChange = (postId, value) => {
//     //     setComments((prevComments) => ({
//     //         ...prevComments,
//     //         [postId]: value
//     //     }))
//     // }

//     const handleAddComment = async (postId) => {
//         try {
//             const res = await dispatch(addComment({ postId, comments }))
//             if (res.meta.requestStatus === 'fulfilled') {
//                 setComments('')
//                 handleGetComment(postId)
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     return (
//         <>
//             <div className='mt-3'>
//                 <button className='btn btn-outline-dark' onClick={handleShow} > + ADD POST</button>
//             </div>
//             {
//                 post && post?.map((post) => (
//                     <div key={post._id} className='col-lg-4 col-md-6 col-sm-12'>
//                         <div className="border border-1 rounded-3 m-3 shadow">
//                             <h3 className='text-center'>{post.postTitle}</h3>
//                             <h5 className='text-center'>{post.description}</h5>
//                             <hr />
//                             <div className='text-center'>
//                                 <LiaEdit
//                                     className='me-5 mb-2'
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                     onClick={() => { handleEditPost(post._id, post) }}
//                                 />
//                                 <MdOutlineDelete
//                                     className='me-5 mb-2'
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                     onClick={() => { handleDeletePost(post._id) }}
//                                 />
//                             </div>
//                         </div>
//                         <div className='m-3'>
//                             <div className='d-flex'>
//                                 <TextareaAutosize
//                                     className='w-100 rounded p-1 mx-2'
//                                     placeholder="Add a comment"
//                                     value={comments[post._id] || ''}
//                                     onChange={(e) => setComments(e.target.value)}
//                                 />
//                                 <div>
//                                     <button
//                                         className='btn btn-outline-primary me-2'
//                                         onClick={() => handleAddComment(post._id)}
//                                     >Add</button>
//                                 </div>
//                             </div>
//                             {commentByPostId[post._id]?.map((comment) => (
//                                 <div key={comment._id} className='p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
//                                     <div className='d-flex'>
//                                         <img src={user} style={{ width: '40px', maxHeight: '40px' }} alt='User' />
//                                         <div className='px-2'>
//                                             <h6 className='m-0 p-0'>{comment.userId.fullName}</h6>

//                                             {
//                                                 editingCommentId === comment._id ? (
//                                                     <div className='d-flex'>
//                                                         <Input
//                                                             value={editedComment}
//                                                             onChange={(e) => setEditedComment(e.target.value)}
//                                                             className='me-3'
//                                                         />
//                                                         <button
//                                                             className='btn btn-sm btn-outline-primary'
//                                                         // onClick={() => handleUpdatedComment(comment._id)}
//                                                         >Update</button>
//                                                     </div>
//                                                 ) : (
//                                                     <p className='m-0 p-0'>{comment.comment}</p>
//                                                 )
//                                             }
//                                         </div>
//                                     </div>

//                                     {
//                                         authorizedUser && authorizedUser._id === comment.userId._id && (
//                                             <div className='d-flex justify-content-end mt-2'>
//                                                 <LiaEdit
//                                                     className='mx-2'
//                                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                                 // onClick={() => handleEditComment(comment._id, comment.comment)}
//                                                 />
//                                                 <MdOutlineDelete
//                                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                                 // onClick={() => handleDeleteComment(comment._id)}
//                                                 />
//                                             </div>
//                                         )
//                                     }
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ))
//             }

//             <PostForm
//                 edit={edit}
//                 show={show}
//                 setShow={setShow}
//                 updateValue={updateValue}
//                 premiumPostId={premiumPostId}
//                 setEdit={setEdit}
//                 getAllPost={getAllPost}
//             />

//         </>
//     )
// }

// export default UserPost


// import React, { useEffect, useState } from 'react'
// import { getPostByUserId } from '../../redux-toolkit/Slice/userPostSlice'
// import { useDispatch } from 'react-redux'
// import { deletePost } from '../../redux-toolkit/Slice/postSlice'
// import { LiaEdit } from 'react-icons/lia'
// import { MdOutlineDelete } from 'react-icons/md'
// import PostForm from './PostForm'
// import { Input, TextareaAutosize } from '@mui/material'
// import user from '../../assets/user.png'
// import Cookies from 'js-cookie'
// import { jwtDecode } from 'jwt-decode'

// const UserPost = () => {
//     const [post, setPost] = useState([])
//     const dispatch = useDispatch()
//     const [edit, setEdit] = useState(false)
//     const [updateValue, setUpdateValue] = useState(null)
//     const [show, setShow] = useState(false);
//     const [premiumPostId, setPostId] = useState(null);

//     const [comment, setComment] = useState('')
//     const [commentById, setCommentById] = useState([])
//     const [editingCommentId, setEditingCommentId] = useState(null)
//     const [editedComment, setEditedComment] = useState('')

//     const token = Cookies.get('token')
//     const authorizedUser = jwtDecode(token)

//     const handleShow = () => {
//         setShow(true)
//     };

//     useEffect(() => {
//         getAllPost()
//     }, [dispatch])

//     const getAllPost = async () => {
//         const res = await dispatch(getPostByUserId())
//         console.log(res.payload.data.data, "res of getUserPost")
//         setPost(res.payload.data.data)
//     }
//     const handleEditPost = async (postId, post) => {
//         setShow(true)
//         setEdit(true)
//         setPostId(postId)
//         setUpdateValue(post)
//     }

//     const handleDeletePost = async (postId) => {
//         const res = await dispatch(deletePost(postId))
//         console.log(res)
//         if (res.meta.requestStatus === 'fulfilled') {
//             getAllPost()
//         }

//     }

//     console.log(post, "-----------post------------")

//     return (
//         <>
//             <div className='mt-3'>
//                 <button className='btn btn-outline-dark' onClick={handleShow} >+ ADD POST</button>
//             </div>
//             {
//                 post && post?.map((post) => (
//                     <div className='col-lg-4 col-md-6 col-sm-12'>
//                         <div className="border border-1 rounded-3 m-3 shadow">
//                             <h3 className='text-center'>{post.postTitle}</h3>
//                             <h5 className='text-center'>{post.description}</h5>
//                             <hr />
//                             <div className='text-center'>
//                                 <LiaEdit
//                                     className='me-5 mb-2'
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                     onClick={() => { handleEditPost(post._id, post) }}
//                                 />
//                                 <MdOutlineDelete
//                                     className='me-5 mb-2'
//                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                     onClick={() => { handleDeletePost(post._id) }}
//                                 />
//                             </div>
//                         </div>
//                         <div className='m-3'>
//                             <div className='d-flex'>
//                                 <TextareaAutosize
//                                     className='w-100 rounded p-1 mx-2'
//                                     placeholder="Add a comment"
//                                     value={comment}
//                                     onChange={(e) => setComment(e.target.value)}
//                                 />
//                                 <div>
//                                     <button
//                                         className='btn btn-outline-primary me-2'
//                                     // onClick={handleAddComment}
//                                     >Add</button>
//                                 </div>
//                             </div>
//                             {commentById.map((comment) => (
//                                 <div key={comment._id} className='p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
//                                     <div className='d-flex'>
//                                         <img src={user} style={{ width: '40px', maxHeight: '40px' }} alt='User' />
//                                         <div className='px-2'>
//                                             <h6 className='m-0 p-0'>{comment.userId.fullName}</h6>

//                                             {
//                                                 editingCommentId === comment._id ? (
//                                                     <div className='d-flex'>
//                                                         <Input
//                                                             value={editedComment}
//                                                             // onChange={(e) => setEditedComment(e.target.value)}
//                                                             className='me-3'
//                                                         />
//                                                         <button
//                                                             className='btn btn-sm btn-outline-primary'
//                                                         // onClick={() => handleUpdatedComment(comment._id)}
//                                                         >Update</button>
//                                                     </div>
//                                                 ) : (
//                                                     <p className='m-0 p-0'>{comment.comment}</p>
//                                                 )
//                                             }
//                                         </div>
//                                     </div>

//                                     {
//                                         authorizedUser && authorizedUser._id === comment.userId._id && (
//                                             <div className='d-flex justify-content-end mt-2'>
//                                                 <LiaEdit
//                                                     className='mx-2'
//                                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                                 // onClick={() => handleEditComment(comment._id, comment.comment)}
//                                                 />
//                                                 <MdOutlineDelete
//                                                     style={{ fontSize: '25px', fontWeight: 'bolder' }}
//                                                 // onClick={() => handleDeleteComment(comment._id)}
//                                                 />
//                                             </div>
//                                         )
//                                     }
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                 ))
//             }
//             <PostForm
//                 edit={edit}
//                 show={show}
//                 setShow={setShow}
//                 updateValue={updateValue}
//                 premiumPostId={premiumPostId}
//                 setEdit={setEdit}
//                 getAllPost={getAllPost}
//             />
//         </>
//     )
// }

// export default UserPost 
