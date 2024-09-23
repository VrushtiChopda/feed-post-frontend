import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom';

const NavbarPage = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        Cookies.remove('token')
        navigate('/')
    }
    return (
        <>
            <Navbar style={{ backgroundColor: '#23283d' }}>
                <Container>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Navbar.Brand className='text-white'>FEED-POST</Navbar.Brand>
                        </Nav>
                        <Nav>
                            <Link className='text-white mx-3 text-decoration-none' to="/dashboard/profile">Profile</Link>
                            <Link className='text-white text-decoration-none' onClick={handleLogout}>
                                Log-out
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarPage
