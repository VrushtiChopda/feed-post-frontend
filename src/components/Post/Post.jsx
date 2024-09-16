import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, deletePost } from '../../redux-toolkit/Slice/postSlice';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import { LiaEdit } from 'react-icons/lia';
import { MdOutlineDelete } from 'react-icons/md';

const Post = () => {
    const [postDetail, setPostDetail] = useState(null);
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [updateValue, setUpdateValue] = useState(null);
    const [premiumPostId, setPostId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.post);

    const handleShow = () => setShow(true);

    useEffect(() => {
        getAllPost();
    }, []);

    //------ all posts ------
    const getAllPost = async () => {
        const postData = await dispatch(getPost());
        console.log(postData.payload.data, "payload get all post")
        setPostDetail(postData.payload.data);
        return postData.payload.data;
    };

    //------ Delete post -----
    const handleDeletePost = async (postId) => {
        try {
            await dispatch(deletePost(postId));
            await getAllPost();
        } catch (error) {
            console.log(error);
        }
    };

    // //------ edit post -------
    const handleEditPost = (postId, postDetail) => {
        setPostId(postId);
        setEdit(true);
        setUpdateValue(postDetail);
        setShow(true);
    };

    //------ Navigate to post detail page -------
    const handleClick = (post) => {
        navigate('/postdetail', { state: { postdata: post } });
    };

    return (
        <>
            <div className="container justify-content-center">
                <div className="row">
                    <h1 className="text-center">Post Details</h1>
                    <div className="mt-3">
                        <button className="btn btn-outline-dark" onClick={handleShow}>+ ADD POST</button>
                    </div>
                    {postDetail && postDetail.map((post) => (
                        <div key={post._id} className="col-lg-4 col-md-6 col-sm-12">
                            <div className="border border-1 rounded-3 m-3 shadow" onClick={() => handleClick(post)}>
                                <img src={post.postImage} alt='post image' />
                                <h3 className="text-center">{post.postTitle}</h3>
                                <h5 className="text-center">{post.description}</h5>
                                {/* <div className="text-center">
                                    <LiaEdit
                                        className="me-5 mb-2"
                                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                        onClick={() => handleEditPost(post._id, post)}
                                    />
                                    <MdOutlineDelete
                                        className="me-5 mb-2"
                                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                        onClick={() => handleDeletePost(post._id)}
                                    />
                                </div> */}
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
                getAllPost={getAllPost}
            />
        </>
    );
};

export default Post; 