import React from 'react'
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import UserContext from '../../context/UserContext';
import Search from '../search/Search';


export default function NavigationBar() {
    const user = React.useContext(UserContext);
    return (
        <Navbar bg="light" expand="md">
            <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
            <Search inline></Search>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Item><Link to="/">Home</Link></Nav.Item>
                    <Nav.Item><Link to={"/profile/"+user.id}>Profile</Link></Nav.Item>
                    {user.isLoggedIn ? <Nav.Item onClick={user.logout}><Link to=' '>Log out</Link></Nav.Item> : <Nav.Item><Link to="/">login</Link></Nav.Item>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
