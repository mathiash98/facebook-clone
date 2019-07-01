import React from 'react'
import AuthHelper from '../../utils/AuthHelper';
import Friend from './Friend';

import './friendList.css';
import { ListGroup, Card } from 'react-bootstrap';
import Chat from './Chat';

const auth = new AuthHelper();

export default function FriendList(props) {
    const [ friends, setFriends ] = React.useState([]);
    const [ chats, setChats ] = React.useState([]);

    React.useLayoutEffect(() => {
        
        console.log('doing something');
        auth.fetch('/api/user/friend', {
            method: 'GET'
        })
        .then(friends => {
            console.log(friends);
            setFriends(friends);
        })
        .catch(err => {
            console.error(err);
        });

    }, []);

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
                <h4>Friends</h4>
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
