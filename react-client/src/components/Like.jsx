import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Like(props) {
    return (
        <span onClick={props.onClick}>
            <FontAwesomeIcon icon={props.liked ? ['fas', 'thumbs-up'] : ['far', 'thumbs-up']}/> {props.children}
        </span>
    )
}
