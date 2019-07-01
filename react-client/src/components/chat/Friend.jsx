import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import Avatar from '../avatar/Avatar';

export default function Friend(props) {
    return (
        <Container onClick={props.onClick} id={props.id} className="friend">
            <Row>
                <Col xs={2}>
                    <Avatar imgId={props.avatar}></Avatar>
                </Col>
                <Col xs={10}>
                    <h6>{props.first_name} {props.last_name}</h6>
                </Col>
            </Row>
        </Container>
    )
}
