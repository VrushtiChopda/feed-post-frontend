import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getPostByUserId } from '../../redux-toolkit/Slice/userPostSlice';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import { BiArchiveIn } from 'react-icons/bi';
import { archivePost } from '../../redux-toolkit/Slice/postSlice';

const UserPost = () => {
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const [updateValue, setUpdateValue] = useState(null);
    const [show, setShow] = useState(false);
    const [premiumPostId, setPostId] = useState(null);

    const BASE_URL = process.env.REACT_APP_BASE_URL
    useEffect(() => {
        getAllPosts();
    }, []);

    // Fetch all posts
    const getAllPosts = async () => {
        const res = await dispatch(getPostByUserId());
        setPosts(res?.payload?.data?.data);
    };

    const handleArchiveClick = async (postId) => {
        console.log(postId, "--------- postId in archive")
        const res = await dispatch(archivePost({ postId, archiveStatus: true }))
        if (res.meta.requestStatus === 'fulfilled') {
            getAllPosts()
        }
        console.log(res, "---------- res in archive ------------ ")
    }

    // Navigate to post detail page
    const handleClick = (post) => {
        navigate('/dashboard/userpostdetail', { state: { postData: post } });
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <h1 className='text-center m-2'>My Posts</h1>
                    <div className='col-12 text-center mt-3'>
                        <button className='btn btn-outline-dark' onClick={() => setShow(true)}> + ADD POST</button>
                    </div>
                    {posts && posts.map((post) => (
                        <div key={post?._id} className="col-lg-4 col-md-6 col-sm-12">
                            <div className="border border-1 rounded-3 m-3 shadow position-relative" >
                                <div
                                    className="position-absolute end-0 m-2 p-1 bg-white rounded"
                                    style={{ zIndex: 1 }}
                                    onClick={() => handleArchiveClick(post?._id)}
                                >
                                    <BiArchiveIn size={24} />
                                </div>
                                <div onClick={() => handleClick(post)}>
                                    {
                                        post?.onCloudinaryLink && (
                                            <img src={post.onCloudinaryLink} className=' object-fit-cover rounded-top-3' alt='post image' style={{ height: '230px' }} />
                                        )
                                    }
                                    <h3 className="text-center">{post.postTitle}</h3>
                                    <h5 className="text-center">{post.description}</h5>
                                </div>
                            </div>
                        </div>
                        // <div className='col-lg-4 col-md-6 col-sm-12 position-relative' onClick={() => handleClick(post)}>
                        //     <div
                        //         className="position-absolute end-0 m-2 p-1 bg-white rounded"
                        //         style={{ zIndex: 1 }}
                        //     // onClick={handleArchiveClick}
                        //     >
                        //         <BiArchiveIn size={24} />
                        //     </div>
                        //     <div className="border border-1 rounded-3 m-3 shadow">
                        //         {
                        //             post?.postImage && (
                        //                 <img src={`${BASE_URL}/${post.postImage}`} className='object-fit-cover rounded-top-3' alt='post image' style={{ height: '230px' }} />
                        //             )
                        //         }
                        //         <h3 className='text-center'>{post.postTitle}</h3>
                        //         <h5 className='text-center'>{post.description}</h5>
                        //     </div>
                        // </div>
                    ))}
                </div>
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
    );
};

export default UserPost;
