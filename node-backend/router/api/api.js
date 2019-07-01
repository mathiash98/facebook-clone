// API requests get routed here
console.log("Hello from api.js");
const express = require('express');
const router = express.Router();

const user = require('./user');
const post = require('./post');
const img = require('./img');
const feed = require('./feed');
const chat = require('./chat');

router.use('/user', user); // /api/user
router.use('/post', post); // /api/post
router.use('/img', img); // /api/img
router.use('/feed', feed); // /api/feed
router.use('/chat', chat); // /api/chat

router.get('/', function (req, res) {
    res.send('localhost:3000/api')
});

module.exports = router;