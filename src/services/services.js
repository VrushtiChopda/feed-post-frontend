import axios from "axios"
import Cookies from 'js-cookie'
export const registerService = async (data) => {
    console.log(data, "------- data -----------")
    const registerData = await axios.post('http://localhost:3000/user/register', data)
        .then((res) => {
            console.log(res)
            return res
        })
        .catch((error) => {
            console.log(error)
        })
    return registerData
}

export const loginService = async (Data) => {
    const data = await axios.post('http://localhost:3000/user/login', Data)
        .then(
            (res) => {
                console.log(res)
                return res
            }
        ).catch((error) => {
            console.log(error)
        })
    return data
}

export const getUserByIdService = async (userId) => {
    const data = await axios.get(`http://localhost:3000/user/getuser/${userId}`)
        .then(
            (res) => {
                console.log(res)
                return res
            }
        ).catch(
            (error) => {
                console.log(error)
            }
        )
    return data
}

export const getAllPostsService = async () => {
    const data = await axios.get('http://localhost:3000/post/getpost')
        .then(
            (res) => {
                return res
            }
        ).catch(
            (error) => {
                console.log(error)  
            }
        )
    return data
}

export const addPostService = async (postData) => {
    console.log(postData, "postData in addPostService")
    const token = Cookies.get('token')
    const data = await axios.post('http://localhost:3000/post/addPost', postData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
        .then(
            (res) => {
                return res
            }
        ).catch((err) => {
            console.log(err)
        })
    return data
}

export const deletePostService = async (postId) => {
    const token = Cookies.get('token')
    console.log(token, "------------token in service----------")
    const data = await axios.delete(`http://localhost:3000/post/deletePost/${postId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    ).then(
        (res) => {
            return res
        }
    ).catch((error) => {
        console.log(error)
    })
    return data
}

export const editPostService = async (postId, postData) => {
    console.log(postId, "postId in servicer")
    const token = Cookies.get('token')
    const data = await axios.put(`http://localhost:3000/post/updatePost/${postId}`, postData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    ).then(
        (res) => {
            console.log(res)
            return res;
        }
    ).catch(
        (err) => {
            console.log(err)
            return err;
        }
    )
    return data
}