import React from 'react'

import { Form, Button } from 'react-bootstrap';

import useForm from '../hooks/useForm';

import Auth from '../../utils/AuthHelper';

const auth = new Auth();

export default function Register() {
    const [ values, handleChange, handleSubmit ] = useForm(registerFunction);

    function registerFunction() {
        console.log(values);
        auth.register(values)
        .then(token => {
            console.log('Logged in');

        })
        .catch(err => {
            console.error(err);
        });
    }

    return (
        <div className="registerContainer">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRegisterEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} required/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formRegisterFirstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="text" placeholder="First name" name="first_name" onChange={handleChange} required/>
                </Form.Group>
                <Form.Group controlId="formRegisterLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" placeholder="Last name" name="last_name" onChange={handleChange} required/>
                </Form.Group>

                <Form.Group controlId="formRegisterPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} required/>
                </Form.Group>
                <Form.Group controlId="formRegisterBirth">
                    <Form.Label>Birth date</Form.Label>
                    <Form.Control type="date" name="birth" onChange={handleChange} required></Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </div>
    )
}
