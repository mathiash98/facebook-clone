import React from 'react'
import { Link } from 'react-router-dom';
import { Form, FormControl, ListGroup } from 'react-bootstrap';
import useForm from '../hooks/useForm';
import AuthHelper from '../../utils/AuthHelper';
import Friend from '../chat/Friend';

import './search.css';

const auth = new AuthHelper();

export default function Search(props) {
    const [ state, setState ] = React.useState({
        focus: false
    });
    const [ values, handleChange, handleSubmit ] = useForm(searchFunction);
    const [ results, setResults ] = React.useState([]);

    function searchFunction() {
        auth.fetch('/api/user?q='+values.search, {
            method: 'GET'
        })
        .then(users => {
            setResults(users);
        })
        .catch(err => {
            console.error(err);
        });
    }

    React.useEffect(() => {
        if (values.search !== '') {
            searchFunction();
        } else {
            setResults([]);
        }
    }, [values]);

    function toggleFocus(val) {
        setState({
            ...state,
            focus: (val ? val : !state.focus)
        });
    }

    return (
        <>
            <Form className="searchForm" onSubmit={handleSubmit}>
                <FormControl autoComplete="off" type="text" placeholder="Search..." onChange={handleChange} onFocus={() => {toggleFocus(true)}} name="search"></FormControl>
                {results.length > 0 ? (
                    <ListGroup className={"searchResults" + (state.focus ? ' visible' : ' hidden')}>
                        {results.map(result => (
                            <ListGroup.Item key={result.id} onClick={() => {toggleFocus(false)}}>
                                <Link to={'/profile/'+result.id}>
                                    <Friend {...result}></Friend>
                                </Link>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : ''}
            </Form>
        </>
    )
}
