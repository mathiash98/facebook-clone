import React from 'react'

import './chat.css';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import useForm from '../hooks/useForm';

import io from 'socket.io-client';
import AuthHelper from '../../utils/AuthHelper';
import Message from './Message';

const auth = new AuthHelper();

export default function Chat(props) {
    const userId = auth.getTokenData().id;
    const [ values, handleChange, handleSubmit, setValues ] = useForm(sendChatMessage, {message: ''});
    const [ state, setState ] = React.useState({
        minimized: false,
        loaded: false,
        error: false
    });
    const [ messages, setMessages ] = React.useState([]);

    React.useEffect(() => {
        // Get initial messages
        auth.fetch('/api/chat/'+props.id, {
            method: 'GET'
        })
        .then(messages => {
            setState(s => {
                return {
                    ...s,
                    error: false,
                    loaded: true
                }
            });
            setMessages(messages);
        })
        .catch(err => {
            console.error(err);
            setState(s => {
                return {
                    ...s,
                    error: err,
                    loaded: true
                }
            });
        });
    }, [props.id]);

    React.useEffect(() => {
        // Scroll to bottom on chat, when new message is sent
        console.log('Scroll to bottom');
        const messagesDOM = document.getElementById('chat-'+props.id);
        if (messagesDOM) {
            messagesDOM.scrollTop = messagesDOM.scrollHeight;
        }
    }, [messages, props.id]);

    function sendChatMessage() {
        try {
            state.socket.emit('new message', {
                message: values.message,
                to: props.id,
                roomName: state.roomName
            });
            setValues(values => ({ ...values, message: ''}));
        } catch (error) {
            console.error(error);
        }
    }

    React.useLayoutEffect(() => {
        // Subscribe to socketIO chat
        console.log('connecting');
        const socket = io.connect(auth.domain,{
            query: {
              token: auth.getToken()
            }
          });
        socket.on('connect', (data) => {
            socket.emit('join', 'HEELLOOO');
            console.log('connected');
            socket.emit('/chat/user', {userId: props.id});

            socket.on('chatJoined', (data) => {
                console.log(data);
                setState(s => {
                    return {
                        ...s,
                        roomName: data,
                        socket: socket
                    }
                });
            });

            socket.on('new message', (data) => {
                console.log('New message:', data);
                setMessages(prevMsgs => [...prevMsgs, data]);
            })
        });
    }, [props.id]);

    function toggleMinimize() {
        setState({
            ...state,
            minimized: !state.minimized
        });
    }

    return (
        <Card className="chat">
            <Card.Header onClick={toggleMinimize} className="chat-header">
                <span>{props.first_name} {props.last_name}</span> <Button variant="outline-danger" size="sm" onClick={props.closeChat}>x</Button>
            </Card.Header>
            {state.minimized ? "" : (
                <Card.Body className="chat-body">
                        <div className="chat-messages" id={"chat-"+props.id}>
                            {!state.loaded ? <Spinner animation="grow"></Spinner> : (
                            <>
                                {messages.map(message => <Message key={message.id} {...message} userId={userId}></Message>)}
                            </>
                            )}
                            {state.error}
                        </div>
                        <Form onSubmit={handleSubmit} className="chat-form">
                            <Form.Control
                                type="text"
                                name="message"
                                onChange={handleChange}
                                placeholder="Message"
                                value={values.message}
                                autoComplete="off"
                            />
                            <Button type="submit" size="sm">Send</Button>
                        </Form>
                </Card.Body>
            )}
        </Card>
    )
}
