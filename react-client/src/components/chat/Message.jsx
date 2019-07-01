import React from 'react';

import './message.css';

export default function Message(props) {
    return (
        <div className={"chat-message " + (props.userId === props.from_user_id ? "sender" : "receiver")}>
            {props.message}
        </div>
    )
}
