import React from 'react'
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';

import './postComposer.css';

import useForm from '../hooks/useForm';
import AuthHelper from '../../utils/AuthHelper';

const auth = new AuthHelper();
export default function PostComposer(props) {
    const [ values, handleChange, handleSubmit, setValues ] = useForm(submitPost, {text: '', img: []});

    function submitPost() {
        console.log(values);
        let body = JSON.stringify(values);
        let headers = {
            'Content-Type': 'application/json'
        };
        if (values.img.length > 0) {
            body = new FormData();
            body.append('text', values.text);
            for (var i = 0; i < values.img.length; i++) {
                body.append('file'+i, values.img[i]);
            }
            headers = {
            };
        }
        auth.fetch('/api/post', {
            method: 'POST',
            body: body,
            headers: headers
        })
        .then(response => {
            console.log(response);
            if (props.onPost) {
                props.onPost();
            }
            setValues(values => ({text: '', img: []}));
        })
        .catch(err => {
            console.error(err);
        });
    }
    return (
        <Card className="postComposer">
            <Card.Header>Write a new post</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                <Container>
                    <Row>
                        <Col xs={12}>
                            <Form.Control as="textarea" rows="3" name="text"
                                placeholder="What is on your mind?"
                                onChange={handleChange}
                                value={values.text}
                                className="postComposer-input-text"/>
                            <Form.Control name="img"
                                type="file"
                                multiple
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="submit">Share</Button>
                        </Col>
                    </Row>
                </Container>
                </Form>
            </Card.Body>
        </Card>
    )
}
