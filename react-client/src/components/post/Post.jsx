import React from 'react'
import { Card, Row, Container, Col } from 'react-bootstrap';
import Avatar from '../avatar/Avatar';
import Like from '../Like';
import AuthHelper from '../../utils/AuthHelper';
import CommentButton from '../CommentButton';
import Comments from '../Comments';
import Slideshow from '../slideshow/Slideshow';

const auth = new AuthHelper();

export default function Post(props) {
    const [ state, setState ] = React.useState({
        ...props,
        showComments: false
    });
    function likePost() {
        console.log('liking',  props.id);
        auth.fetch('/api/post/'+props.id+'/like', {
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

    /**
     * Calculates difference from Date.now and time
     * @param time
     * @returns {String} One of the following: seconds, minutes, hours, days, weeks, months, years, decades
     */
    function parseDateTime(time) {
        // TODO: Extract as utility
        const now = Date.now();
        const t = new Date(time);
        const diff = Math.floor((now-t)/1000);
        
        // Art or code?
        // Is there a better way to do it?
             if (diff < 60) return diff + ' seconds ago';
        else if (diff < 60*60) return Math.floor(diff/60) + ' minutes ago';
        else if (diff < 60*60*24) return Math.floor(diff/60/60) + ' hours ago';
        else if (diff < 60*60*24*7) return Math.floor(diff/60/60/24) + ' days ago';
        else if (diff < 60*60*24*7*30) return Math.floor(diff/60/60/24/7) + ' weeks ago';
        else if (diff < 60*60*24*7*30*365) return Math.floor(diff/60/60/24/7/30) + ' months ago';
        else if (diff < 60*60*24*7*30*365*10) return Math.floor(diff/60/60/24/7/30/365) + ' years ago';
        else if (diff < 60*60*24*7*30*365*1000) return Math.floor(diff/60/60/24/7/30/365/10) + ' decades ago';
    }

    function toggleComments() {
        console.log('toggleComments');
        if (state.commentsLoaded) {
            setState({
                ...state,
                showComments: !state.showComments
            });
            
        } else {
            auth.fetch('/api/post/'+state.id+'/comment', {
                method: 'GET'
            })
            .then(data => {
                console.log(data);
                setState({
                    ...state,
                    comments: data,
                    commentsLoaded: true,
                    showComments: true
                });
            })
            .catch(err => {
                console.error(err);
            })
        }
    }

    return (
        <Card className="postCard">
            <Card.Body>
                <Container>
                    <Row>
                        <Col xs={2} style={{paddingRight:0, paddingLeft:0}}>
                            <Avatar imgId={state.avatar}></Avatar>
                        </Col>
                        <Col xs={{offset:1}}>
                            <Row>
                                <h5>{state.first_name} {state.last_name}</h5>
                            </Row>
                            <Row>
                                {parseDateTime(state.created_at)}
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <p>
                            {state.text}
                        </p>
                        {state.images ? (<Slideshow images={state.images.split(',')}/>) : ''}
                    </Row>
                </Container>
            </Card.Body>
            <Card.Footer>
                <span> {state.likes_num} <Like liked={state.liked} onClick={likePost}>Like</Like></span>
                <span onClick={toggleComments}> {state.comments_num} <CommentButton>Comment</CommentButton></span>
                {state.showComments ? <Comments comments={state.comments}/> : ""}
            </Card.Footer>
        </Card>
    )
}
