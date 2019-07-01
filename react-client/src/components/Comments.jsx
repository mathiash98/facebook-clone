import React from 'react'
import Comment from './Comment';

export default function Comments(props) {
    return (
        <div className="comments">
            {props.comments.map(comment => <Comment {...comment} key={comment.id}/> )}
        </div>
    )
}
