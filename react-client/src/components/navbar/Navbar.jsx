import React from 'react'
import { Link } from 'react-router-dom';

import { Tab } from 'evergreen-ui';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li><Tab><Link to="/">Home</Link></Tab></li>
                <li><Tab><Link to="/profile">Profile</Link></Tab></li>
            </ul>
        </nav>
    )
}
