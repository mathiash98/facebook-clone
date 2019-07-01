import { useState } from 'react'

/**
 * React hook for form value handling
 * @param submitFunction Callback that get's called onSubmit
 */
export default function useForm(submitFunction, initial) {
    const [values, setValues] = useState((initial ? initial : {}));

    /**
     * Handle change in input element
     * @param e Event
     */
    const handleChange = (e) => {
        e.persist();
        const name = e.target.name;
        let value;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else if (e.target.type === 'file') {
            value = e.target.files;
        } else {
            value = e.target.value;
        }
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

    return [
        values,
        handleChange,
        handleSubmit,
        setValues
    ]
}
