import React from 'react'

// Components
import Post from '../post/Post';

import Auth from '../../utils/AuthHelper';

const auth = new Auth();

export default function Feed(props) {
    const [ posts, setPosts ] = React.useState([]);

    React.useEffect(() => {
        auth.fetch('/api/post'+(props.userId ? '?user_id='+props.userId : ''), {
            method: 'GET'
        })
        .then(data => {
            setPosts(data);
        })
        .catch(err => {
            console.error(err);
        });
    }, [props.userId]); // Empty array to run only once, since an empty array never changes.

    return (
        <div className="feed">
            <h1>Feed</h1>
            {posts.map((post) => <Post {...post} key={post.id}></Post>)}
        </div>
    )
}
