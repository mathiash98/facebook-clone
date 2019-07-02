import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import Avatar from '../avatar/Avatar';

import './friend.css';

export default function Friend(props) {
    return (
        <Container onClick={props.onClick} id={props.id} className="friend">
            <Row>
                <Col xs={3}>
                    <Avatar imgId={props.avatar}></Avatar>
                </Col>
                <Col xs={9}>
                    <div className="friendName">{props.first_name} {props.last_name}</div>
                </Col>
            </Row>
        </Container>
    )
}
