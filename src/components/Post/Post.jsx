import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getPost } from '../../redux-toolkit/Slice/postSlice';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import { BiArchiveIn } from "react-icons/bi";
const Post = () => {
    const [postDetail, setPostDetail] = useState(null);
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [updateValue, setUpdateValue] = useState(null);
    const [premiumPostId, setPostId] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleShow = () => setShow(true);
    const BASE_URL = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        getAllPost();
    }, []);

    //------ all posts ------
    const getAllPost = async () => {
        const postData = await dispatch(getPost());
        // console.log(postData.payload.data, "payload get all post")
        setPostDetail(postData.payload.data);
        return postData.payload.data;
    };

    //------ Navigate to post detail page -------
    const handleClick = (post) => {
        console.log(post, " --------- post  in post page------------")
        navigate('/dashboard/postdetail', { state: { postdata: post } });
    };
    return (
        <>
            <div className="container justify-content-center">
                <div className="row">
                    <h1 className="text-center m-2">Post Details</h1>
                    <div className="mt-3">
                        <button className="btn btn-outline-dark" onClick={handleShow}>+ ADD POST</button>
                    </div>
                    {postDetail && postDetail.map((post) => (
                        <div key={post._id} className="col-lg-4 col-md-6 col-sm-12">
                            <div className="border border-1 rounded-3 m-3 shadow" >

                                <div onClick={() => handleClick(post)}>
                                    {
                                        post?.postImage && (
                                            <img src={`${BASE_URL}/${post.postImage}`} className=' object-fit-cover rounded-top-3' alt='post image' style={{ height: '230px' }} />
                                        )
                                    }
                                    <h3 className="text-center">{post.postTitle}</h3>
                                    <h5 className="text-center">{post.description}</h5>
                                </div>
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