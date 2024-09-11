import React, { useEffect, useState } from 'react'
import user from '../../assets/user.png'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { getUserByIdService } from '../../services/services'
const UserProfile = () => {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const token = Cookies.get('token')
        // console.log(token)
        const userdata = jwtDecode(token)
        // console.log(userdata._id, "userId")

        const profileData = async () => {
            const profileDetail = await getUserByIdService(userdata._id)
            // console.log(profileDetail.data, "--------user Data-----")
            setProfile(profileDetail.data.data)
        }
        profileData()
    }, [])

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="m-3 col-lg-3 border border-1 rounded-5 shadow ">
                        {
                            profile && (
                                <>
                                    <img src={user} alt='user profile' className='w-50' />
                                    <div>
                                        <h2>{profile.fullName}</h2>
                                        <h4>{profile.email}</h4>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile
