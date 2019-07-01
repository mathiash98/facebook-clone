import React, { useContext } from 'react'

import UserContext from '../../context/UserContext';

import Login from '../../components/login/Login';
import Register from '../../components/register/Register';
import Feed from '../../components/feed/Feed';
import { Container, Row, Col } from 'react-bootstrap';
import PostComposer from '../../components/postComposer/PostComposer';

import './index.css';

export default function Index() {
    const user = useContext(UserContext);

    const [ state, setState ] = React.useState({feedKey: 0}) 

    if (user.isLoggedIn) {
        return (
            <div className="index">
            <Container>
                <Row>
                    <Col sm={8} xs={12}>
                        <PostComposer onPost={() => {setState({...state, feedKey: state.feedKey+1})}}></PostComposer>
                        <Feed key={state.feedKey}></Feed>
                    </Col>
                    <Col sm={4} xs={0}>
                        <div className="ads">
                            <h1>Ads</h1>
                        </div>
                    </Col>
                </Row>
            </Container>
            </div>
        )
    } else {
        return (
            <div className="index">
                <Container>
                    <Row>
                        <Col sm={6}>
                            <h1>Login</h1>
                            <Login></Login>
                        </Col>
                        <Col sm={6}>
                            <h1>Register</h1>
                            <Register></Register>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
