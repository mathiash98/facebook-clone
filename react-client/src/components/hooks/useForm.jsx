import { useState } from 'react'

/**
 * React hook for form value handling
 * @param submitFunction Callback that get's called onSubmit
 */
export default function useForm(submitFunction) {
    const [values, setValues] = useState({});

    /**
     * Handle change in input element
     * @param e Event
     */
    const handleChange = (e) => {
        e.persist();
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setValues( values => ({ ...values, [name]: value}));
    }
    
    /**
     * Handle submit, runs the supplied callback function
     * @param e Event
     */
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        submitFunction();
    }

    return {
        handleChange,
        handleSubmit,
        values
    }
}
