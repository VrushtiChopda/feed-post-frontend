import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie";
function Protected(props) {
    const { Component } = props;
    const navigate = useNavigate();
    useEffect(() => {
        let login = Cookies.get('token')
        console.log(login, "token in protected")
        if (!login) {
            navigate('/')
        }
    })
    return (
        <>
            <Component />
        </>
    )
}
export default Protected