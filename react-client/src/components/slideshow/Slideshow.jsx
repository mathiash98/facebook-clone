import React from 'react'

import './slideshow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthHelper from '../../utils/AuthHelper';

const auth = new AuthHelper();

export default function Slideshow(props) {
    const [ idx, setIdx ] = React.useState(0);

    function nextImg() {
        setIdx((idx+1)%props.images.length);
    }
    
    function prevImg() {
        const newIdx = (idx-1)%props.images.length;
        setIdx((newIdx < 0 ? props.images.length-1 : newIdx));
    }

    return (
        <div className="slideshow">
            <img src={auth.domain+'/api/img/'+props.images[idx]} alt=""/>
            <div>
            <FontAwesomeIcon icon={['far', 'arrow-alt-circle-left']} size="lg" className="prevImg" onClick={prevImg}></FontAwesomeIcon>
            <FontAwesomeIcon icon={['far', 'arrow-alt-circle-right']} size="lg" className="nextImg" onClick={nextImg}></FontAwesomeIcon>

            </div>
        </div>
    )
}
