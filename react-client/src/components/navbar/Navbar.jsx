import React from 'react'
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import UserContext from '../../context/UserContext';
import Search from '../search/Search';


export default function NavigationBar() {
    const user = React.useContext(UserContext);
    return (
        <Navbar bg="white" expand="md">
            <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
            <Search></Search>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="justify-content-end">
                    <Nav.Item><Link to="/" className="nav-link">Home</Link></Nav.Item>
                    <Nav.Item><Link to={"/profile/"+user.id} className="nav-link">Profile</Link></Nav.Item>
                    {user.isLoggedIn ? 
                        (<Nav.Item onClick={user.logout}><Link to=' ' className="nav-link">Log out</Link></Nav.Item>)
                        : (<Nav.Item><Link to="/" className="nav-link">login</Link></Nav.Item>)
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
