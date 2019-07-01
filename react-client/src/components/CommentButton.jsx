import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CommentButton(props) {
    return (
        <span>
           <FontAwesomeIcon icon={['far', 'comment']}></FontAwesomeIcon> {props.children}
        </span>
    )
}
