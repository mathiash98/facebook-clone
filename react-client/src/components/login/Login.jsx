import React from 'react'

import { Form, Button } from 'react-bootstrap';

import useForm from '../hooks/useForm';
import Auth from '../../utils/AuthHelper';

const auth = new Auth();

export default function Login() {
    const [ values, handleChange, handleSubmit ] = useForm(loginFunction);

    function loginFunction() {
        auth.login(values.email, values.password)
        .then(token => {
            console.log(token);
        })
        .catch(err => {
            console.error(err);
        });
    }

    return (
        <div className="loginContainer">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formLoginEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange}/>
                </Form.Group>

                <Form.Group controlId="formLoginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    )
}
