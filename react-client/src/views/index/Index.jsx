import React, { useContext } from 'react'

import UserContext from '../../context/UserContext';

import Login from '../../components/login/Login';

export default function Index() {
    const user = useContext(UserContext);
    console.log(user);

    if (user) {
        return (
            <div>
                
            </div>
        )
    } else {
        return (
            <Login></Login>
        )
    }
}
