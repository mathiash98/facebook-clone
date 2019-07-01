import React from 'react'
import { Media } from 'react-bootstrap';
import Avatar from './avatar/Avatar';
import Like from './Like';
import AuthHelper from '../utils/AuthHelper';


const auth = new AuthHelper();

export default function Comment(props) {
    const [ state, setState ] = React.useState(props);
    function likeComment() {
        auth.fetch('/api/post/'+state.post_id+'/comment/'+state.id+'/like', {
            method: (state.liked ? 'DELETE' : 'POST')
        })
        .then(data => {
            console.log(data);
            setState({
                ...state,
                likes_num: (state.liked ? state.likes_num-1 : state.likes_num+1),
                liked: !state.liked
            });
        })
        .catch(err => {
            console.error(err);
        });
    }
    return (
        <Media>
            <Avatar imgId={state.avatar}></Avatar>
            <Media.Body>
                <h5>{state.first_name} {state.last_name}</h5>
                <p>{state.comment}</p>
                <Like onClick={likeComment} liked={state.liked}>{state.likes_num}</Like>
            </Media.Body>
        </Media>
    )
}
