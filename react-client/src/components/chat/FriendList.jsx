import React from 'react'
import AuthHelper from '../../utils/AuthHelper';
import Friend from './Friend';
import io from 'socket.io-client';
import './friendList.css';
import { ListGroup, Card } from 'react-bootstrap';
import Chat from './Chat';

const auth = new AuthHelper();

export default function FriendList(props) {
    const [ friends, setFriends ] = React.useState([]);
    const [ chats, setChats ] = React.useState([]);

    React.useEffect(() => {        
        auth.fetch('/api/user/friend', {
            method: 'GET'
        })
        .then(friends => {
            setFriends(friends);
        })
        .catch(err => {
            console.error(err);
        });

    }, []);

    React.useEffect(() => {
        // Subscribe to socketIO chat
        const socket = io.connect(auth.domain,{
            query: {
              token: auth.getToken()
            }
          });
        socket.on('connect', (data) => {
            socket.emit('subscribeToChats'); // Subscribe to new chat messages
            socket.on('newChat', (data) => {
                const friend = friends.filter((friend) => friend.id === data.id)[0];
                openChat(friend)
            });
        });
    }, [friends]);

    function openChat(friend) {
        if (chats.indexOf(friend) === -1) {
            setChats([...chats, friend]);
        } 
    }
    
    function closeChat(friend) {
        let newChats = [...chats]; // Can't use '= chats' because it will make a reference
        newChats.splice(chats.indexOf(friend), 1);
        setChats(newChats);
    }

    return (
        <div className="chatFunction">
            <div className="chats">
                {chats.map(friend => <Chat {...friend} key={friend.id} closeChat={e => closeChat(friend)}/>)}
            </div>
            <Card body className="friendList">
                <h4 className="text-center">Friends</h4>
                <ListGroup variant="flush">
                    {friends.map(friend => (friend.id === auth.getTokenData().id ? '' :
                    <ListGroup.Item onClick={e => openChat(friend)} className="friendList-item" key={friend.id}>
                        <Friend {...friend}/>
                    </ListGroup.Item>
                    ))}

                </ListGroup>
            </Card>
        </div>
    )
}
