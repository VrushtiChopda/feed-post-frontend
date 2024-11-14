import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { CiGrid41, CiSquarePlus } from "react-icons/ci";
import { FaBars } from 'react-icons/fa';
import Cookies from 'js-cookie';
import NavbarPage from '../../pages/NavbarPage';

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    // Toggle sidebar collapse
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    // Handle screen resize to auto-toggle on mobile view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/');
    };

    return (
        <>
            <NavbarPage />
            
            <div className="d-flex">
                <Sidebar
                    collapsed={collapsed}
                    backgroundColor='rgb(45, 55, 94)'
                    color='#f5f5f5'
                    style={{ position: 'fixed', zIndex: 2, height: '100vh' }}
                >
                    <div className='vh-100'>
                        <Menu
                            menuItemStyles={{
                                button: {
                                    color: '#f5f5f5',
                                    [`&.active`]: {
                                        backgroundColor: 'rgb(45, 55, 94)',
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
                            {/* <MenuItem component={<Link to="profile" />} icon={<FaRegUserCircle fontSize={'23px'} />}>
                                {!collapsed && "User Profile"}
                            </MenuItem>
                            <MenuItem icon={<IoPower fontSize={'23px'} />} onClick={handleLogout} >
                                {!collapsed && "Log out"}
                            </MenuItem> */}
                        </Menu>
                    </div>
                </Sidebar>

                <div
                    className="content-container"
                    style={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        height: '100vh',
                        marginLeft: collapsed ? '55px' : '250px',
                        transition: 'margin 0.3s ease',
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Dashboard;