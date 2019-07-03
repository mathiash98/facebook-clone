import React from 'react'

import './avatar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthHelper from '../../utils/AuthHelper';

const auth = new AuthHelper();

export default function Avatar(props) {
    if (props.imgId) {
        return (
            <div className="squareAspect">
                <img src={auth.domain+'/api/img/'+props.imgId}
                    alt={props.alt ? props.alt : "Avatar"}
                    className="img avatar"></img>
            </div>
        )
    } else {
        return (
            <div className="squareAspect">
                <FontAwesomeIcon icon={['far', 'user']}
                className="img avatar"
                size="lg"></FontAwesomeIcon>
            </div>
        )
    }
}
