import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { archivePost, getArchivePost } from '../../redux-toolkit/Slice/postSlice'
import { MdOutlineUnarchive } from 'react-icons/md'

const ArchivePost = () => {
    const [post, setPost] = useState([])
    const dispatch = useDispatch()

    const getAllArchivePost = async () => {
        const res = await dispatch(getArchivePost())
        if (res.meta.requestStatus === 'fulfilled') {
            console.log(res.payload.data, "-------- payload data ----------")
            setPost(res.payload.data)
        }
    }

    const handleUnarchiveClick = async (postId) => {
        const res = await dispatch(archivePost({ postId, archiveStatus: false }))
        console.log(res, "response in unarchivePost")
        if (res.meta.requestStatus === 'fulfilled') {
            getAllArchivePost()
        }
    }

    useEffect(() => {
        getAllArchivePost()
    }, [])

    return (
        <>
            <h1 className='text-center m-2'>Your Archived Posts</h1>
            <div className="container">
                <div className="row">
                    {
                        post && post.map((postData) => (
                            <div key={postData._id} className="col-lg-4 col-md-6 col-sm-12 ">
                                <div className="border border-1 rounded-3 m-3 shadow position-relative" >
                                    <div>
                                        <div
                                            className="position-absolute end-0 m-2 p-1 bg-white rounded"
                                            style={{ zIndex: 1 }}
                                            onClick={() => handleUnarchiveClick(postData._id)}
                                        >
                                            <MdOutlineUnarchive size={24} />
                                        </div>
                                        <div>
                                            {
                                                postData?.onCloudinaryLink && (
                                                    <img src={postData?.onCloudinaryLink} className=' object-fit-cover rounded-top-3' alt='post image' style={{ height: '230px' }} />
                                                )
                                            }
                                            <h3 className="text-center">{postData.postTitle}</h3>
                                            <h5 className="text-center">{postData.description}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div >
        </>
    )
}

export default ArchivePost
