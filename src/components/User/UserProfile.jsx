import React, { useEffect, useState } from 'react'
import user from '../../assets/user1.jpg'
import './User.css'
import { useDispatch } from 'react-redux'
import { userProfile } from '../../redux-toolkit/Slice/userSlice'

const UserProfile = () => {
    const [profile, setProfile] = useState(null)
    const dispatch = useDispatch()
    useEffect(() => {
        const profileData = async () => {
            const profileDetail = await dispatch(userProfile())
            console.log(profileDetail.payload.data.data, "--------user Data-----")
            setProfile(profileDetail.payload.data.data)
        }
        profileData()
    }, [])

    return (
        <>
            {/* <div className="container-fluid">
                <div className="row">
                    <div classNameName="m-3 col-lg-3 border border-1 rounded-5 shadow ">
                        {
                            profile && (
                                <>
                                    <img src={user} alt='user profile' class    Name='w-50' />
                                    <div>
                                        <h2>{profile.fullName}</h2>
                                        <h4>{profile.email}</h4>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div> */}
            <div className="container mt-5 mb-5 ">
                <div className="row no-gutters">
                    <div className="col-md-4 col-lg-4 px-0">
                        <img src={user} />
                    </div>
                    <div className="col-md-8 col-lg-8 px-0">
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between align-items-center p-5 bg-dark text-white">
                                <h3 className="display-5">{profile?.fullName}</h3></div>
                            <div className="p-3 bg-black text-white">
                                <h5>{profile?.email}</h5>
                            </div>
                            <div className="d-flex flex-row text-white">
                                <div className="p-4 bg-primary text-center skill-block">
                                    <h4>20</h4>
                                    <h6>Follower</h6>
                                </div>
                                <div className="p-3 bg-success text-center skill-block">
                                    <h4>10</h4>
                                    <h6>Post</h6>
                                </div>
                                <div className="p-3 bg-warning text-center skill-block">
                                    <h4>30</h4>
                                    <h6>Tag</h6>
                                </div>
                                <div className="p-3 bg-danger text-center skill-block">
                                    <h4>100</h4>
                                    <h6>History</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile
