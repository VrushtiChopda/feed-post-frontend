import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getPostByUserId } from '../../redux-toolkit/Slice/userPostSlice';
import { useNavigate } from 'react-router-dom';
import { LiaEdit } from 'react-icons/lia';
import { MdOutlineDelete } from 'react-icons/md';
import PostForm from './PostForm';

const UserPost = () => {
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const [updateValue, setUpdateValue] = useState(null);
    const [show, setShow] = useState(false);
    const [premiumPostId, setPostId] = useState(null);

    useEffect(() => {
        getAllPosts();
    }, []);

    // Fetch all posts
    const getAllPosts = async () => {
        const res = await dispatch(getPostByUserId());
        setPosts(res?.payload?.data?.data);
    };

    // Navigate to post detail page
    const handleClick = (post) => {
        navigate('/userpostdetail', { state: { postData: post } });
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <h1 className='text-center'>My Posts</h1>
                    <div className='mt-3'>
                        <button className='btn btn-outline-dark' onClick={() => setShow(true)}> + ADD POST</button>
                    </div>
                    {posts && posts.map((post) => (
                        <div className='col-lg-4 col-md-6 col-sm-12' onClick={() => handleClick(post)}>
                            <div className="border border-1 rounded-3 m-3 shadow">
                            {
                                    post?.postImage && (
                                        <img src={`http://localhost:3000/${post.postImage}`} alt='post image' style={{ height: '230px' }} />
                                    )
                                }
                                <h3 className='text-center'>{post.postTitle}</h3>
                                <h5 className='text-center'>{post.description}</h5>
                            </div>
                        </div>
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
