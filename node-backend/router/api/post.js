// Post API stuff
const sharp = require('sharp');
const stream = require('stream');
// const streamToArray = require('stream-to-array');
const express = require('express');
const router = express.Router();

const Img = require('../../controllers/Img');
const Post = require('../../controllers/Post');

const auth = require('../utilities/authMiddleware');

router.get('/', auth.isLoggedIn, function (req, res) {
    // Get posts
    let query = {
        ...req.query,
        reqUserId: req.user.id // The user that is logged in
    };
    Post.find(query)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.error(err)
            res.status(500).send(err);
        });
});

router.get('/:id', function (req, res) {
    // Get specific post
    let query = {
        ...req.query,
        id: req.params.id,
        reqUserId: req.user.id // The user that is logged in
    };
    Post.find(query)
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

router.post('/', auth.isLoggedIn, function (req, res) {
    console.log(req.body);
    req.body.userId = req.user.id; // Send userId to the new post
    Post.save(req.body)
    .then(data => {
        res.send('Successfully added post.');
    })
    .catch(err => {
        console.error(err)
        res.status(500).send(err);
    })
});

router.get('/:id/likes', auth.isLoggedIn, function (req, res) {
    Post.getLikesById(req.params.id)
    .then((results, fields) => {
        res.json(results);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err); 
    });
});

router.post('/:id/like', auth.isLoggedIn, function (req, res) {
    Post.like(req.params.id, req.user.id)
    .then((results) => {
        res.send();
    })
    .catch(err => {
        if (err.errno == 1062) {
            // Already liked
            res.send();
        } else {
            res.status(500).send(err); 
        }
    });
});

router.delete('/:id/like', auth.isLoggedIn, function (req, res) {
    Post.unlike(req.params.id, req.user.id)
    .then((affected) => {
        res.send();
    })
    .catch(err => {
        res.status(500).send(err); 
    });
});

router.get('/:id/comment', auth.isLoggedIn, function (req, res) {
    Post.getCommentsByPostId(req.params.id, req.user.id)
    .then(comments => {
        res.json(comments);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.post('/:id/comment', auth.isLoggedIn, function (req, res) {
    Post.comment(req.params.id, req.user.id, req.body.comment)
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.delete('/:id/comment/:commentId', auth.isLoggedIn, function (req, res) {
    Post.deleteCommentById(req.params.commentId, req.user.id)
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.post('/:id/comment/:commentId/like', auth.isLoggedIn, function (req, res) {
    Post.likeComment(req.params.commentId, req.user.id)
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.delete('/:id/comment/:commentId/like', auth.isLoggedIn, function (req, res) {
    Post.unlikeComment(req.params.commentId, req.user.id)
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

module.exports = router;