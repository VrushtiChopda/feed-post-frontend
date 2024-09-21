import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { CiGrid41, CiSquarePlus } from "react-icons/ci";
import { FaRegUserCircle, FaBars } from 'react-icons/fa';
import { IoPower } from "react-icons/io5";
import Cookies from 'js-cookie'

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };
    const handleLogout = () => {
        Cookies.remove('token')
        navigate('/')
    }
    return (
        <>
            <div className='d-flex'>
                <Sidebar collapsed={collapsed} backgroundColor='#23283d' color='#f5f5f5'>
                    <div className='vh-100'>
                        <Menu
                            menuItemStyles={{
                                button: {
                                    color: '#f5f5f5',
                                    [`&.active`]: {
                                        backgroundColor: '#23283d',
                                        color: '#f5f5f5',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#3f4669',
                                        color: '#f5f5f5',
                                    },
                                },
                            }}
                        >
                            <MenuItem
                                icon={<FaBars />}
                                onClick={toggleCollapse}
                                style={{ cursor: 'pointer', fontSize: "23px" }}
                            >
                                {!collapsed}
                            </MenuItem>
                            <MenuItem component={<Link to="posts" />} icon={<CiSquarePlus fontSize={'23px'} />}>
                                {!collapsed && "Post Details"}
                            </MenuItem>
                            <MenuItem component={<Link to="userpost" />} icon={<CiGrid41 fontSize={'23px'} />}>
                                {!collapsed && "User's Post"}
                            </MenuItem>
                            <MenuItem component={<Link to="profile" />} icon={<FaRegUserCircle fontSize={'23px'} />}>
                                {!collapsed && "User Profile"}
                            </MenuItem>
                            <MenuItem icon={<IoPower fontSize={'23px'} />} onClick={handleLogout} >
                                {!collapsed && "Log out"}
                            </MenuItem>
                        </Menu>
                    </div>
                </Sidebar>
                <div className="content-container" style={{ flexGrow: 1, overflowY: 'auto', height: '100vh' }}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Dashboard;