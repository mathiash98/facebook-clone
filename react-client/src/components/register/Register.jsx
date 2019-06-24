import React from 'react'

import { TextInput } from 'evergreen-ui';

import useForm from '../hooks/useForm';

export default function Login() {
    const { values, handleChange, handleSubmit } = useForm(registerFunction);

    function registerFunction () {
        console.log(values);
    }
    return (
        <div className="registerContainer">
            <form onSubmit="handleSubmit">
                <TextInput
                    label="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <TextInput
                    label="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <TextInput
                    label="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <TextInput
                    label="email"
                    name="email"
                    placeholder="Email"
                    required
                />
            </form>

        </div>
    )
}
