import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { FaRegUserCircle } from 'react-icons/fa';

const NavbarPage = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        Cookies.remove('token')
        navigate('/')
    }

    return (
        <>
            <Navbar fixed='top' style={{ backgroundColor: '#23283d', position: 'sticky' }}>
                <Container>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto mt-2">
                            <h4 className='text-white'>FEED-POST</h4>
                        </Nav>
                        <Nav>
                            <NavDropdown title={<FaRegUserCircle fontSize={'30px'} color='white' />} id="basic-nav-dropdown">
                                <NavDropdown.Item >
                                    <Link className='text-black text-decoration-none' to="/dashboard/profile">Profile</Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item >
                                    <Link className='text-black text-decoration-none' onClick={handleLogout}>
                                        Log-out
                                    </Link>
                                </NavDropdown.Item>
                            </NavDropdown>
                            {/* <Link className='text-white mx-3 text-decoration-none' to="/dashboard/profile">Profile</Link>
                            <Link className='text-white text-decoration-none' onClick={handleLogout}>
                                Log-out
                            </Link> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarPage
