import React from 'react'
import AuthHelper from '../../utils/AuthHelper';
import Feed from '../../components/feed/Feed';

import './profile.css';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Avatar from '../../components/avatar/Avatar';
import PostComposer from '../../components/postComposer/PostComposer';
import useForm from '../../components/hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const auth = new AuthHelper();

export default function Profile({ match }) {
    const [ user, setUser ] = React.useState({});
    const [ values, handleChange ] = useForm(null, {});

    const [ refreshKey, setRefreshKey ] = React.useState(0);

    React.useEffect(() => {
        auth.fetch('/api/user/'+match.params.userId, {
            method: 'GET'
        })
        .then(userData => {
            console.log(userData);
            setUser(userData);
        })
        .catch(err => {
            console.error(err);
        })
    }, [match.params.userId, refreshKey]);

    React.useEffect(() => {
        // Change avatar
        if (values.avatar) {
            const formData = new FormData();
            formData.append('avatar', values.avatar[0])
            auth.fetch('/api/user/'+match.params.userId+'/avatar', {
                method: 'POST',
                body: formData
            })
            .then(result => {
                setRefreshKey(r => r+1);
                console.log(result);
            })
            .catch(err => {
                console.error(err);
            });
        }
    }, [values])

    function addFriend (toggle) {
        auth.fetch('/api/user/'+match.params.userId+'/friend', {
            method: (toggle ? 'POST' : 'DELETE')
        })
        .then(response => {
            console.log(response);
            setUser({
                ...user,
                friend: !user.friend
            });
        })
        .catch(err => {
            console.error(err);
        });
    }

    return (
        <div className="profile">
            <Container className="userInfo">
                <Row>
                    <Col xs={2}>
                        <Avatar imgId={user.avatar}></Avatar>
                        {auth.getTokenData().id === Number(match.params.userId) ? (
                            <Form className="avatar-edit-form">
                                <label htmlFor="avatar-file-input" className="avatar-edit">
                                    <FontAwesomeIcon icon={['far', 'edit']} size="lg"/>
                                </label>
                                <Form.Control type="file" name="avatar" onChange={handleChange} id="avatar-file-input"/>
                            </Form>
                        ) : ''}
                    </Col>
                    <Col xs={10}>
                        <h2>{user.first_name} {user.last_name}</h2>
                    </Col>
                </Row>
                <Row>
                {auth.getTokenData().id !== Number(match.params.userId) ? (
                    user.friend ? <Button onClick={() => addFriend(false)}>Remove friend</Button> : <Button onClick={() => addFriend(true)}>Add friend</Button>
                ) : ''}
                </Row>
            </Container>
            {auth.getTokenData().id === Number(match.params.userId) ? <PostComposer></PostComposer> : ''}
            <Feed userId={match.params.userId} key={refreshKey}></Feed>
        </div>
    )
}
