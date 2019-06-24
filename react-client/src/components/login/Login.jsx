import React, { useState } from 'react'

import { TextInput, Button } from 'evergreen-ui';

import useForm from '../hooks/useForm';

export default function Login() {
    const { values, handleChange, handleSubmit } = useForm(loginFunction);

    function loginFunction() {
        console.log(values);
    }

    return (
        <div className="loginContainer">
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    spellCheck="false"
                    required
                    validationMessage="This field is required"
                    onChange={handleChange}
                />
                <TextInput
                    label="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                    required
                    validationMessage="This field is required"
                    onChange={handleChange}
                />
                <Button appearance="primary" intent="success">login</Button>
            </form>

        </div>
    )
}
