// User API stuff
console.log("Hello from api user.js");
const express = require('express');
const router = express.Router();

const User = require('../../controllers/User');
const Post = require('../../controllers/Post');
const Friend = require('../../controllers/Friend');

const auth = require('../utilities/authMiddleware');

router.get('/', function (req, res) {
    console.log('/api/user');
    User.find(req.query)
    .then(data => {
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});

router.post('/', auth.isAdmin, function (req, res) {
    User.save(req.body)
    .then(data => {
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});

// Friends
router.get(['/:id/friend', '/friend'], auth.isLoggedIn, function (req, res) {
    // Get all friends
    // if req.params.id -> get friends of that user
    // else get friends of req.user.id
    console.log('get friends==================');
    Friend.findByUserId((req.params.id ? req.params.id : req.user.id))
    .then(friends => {
        console.log(friends);
        console.log('==============done==================');
        res.json(friends);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.post('/:id/friend', auth.isLoggedIn, function (req, res) {
    Friend.save(req.user.id, req.params.id)
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.post('/:id/avatar', auth.isLoggedIn, function (req, res) {
    console.log(req.body);
    User.updateById(req.user.id, {avatar: req.body._images[0].small.toString()})
    .then(results => {
        console.log(results);
        res.sendStatus(200);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});

router.delete('/:id/friend', auth.isLoggedIn, function (req, res) {
    Friend.delete(req.user.id, req.params.id)
    .then(result => {
        res.send('Successfully removed friendship');
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.get('/:id', function (req, res) {
    User.find({id: req.params.id, reqUserId: req.user.id})
    .then(data => {
        res.json(data[0]);
    })
    .catch(err => {
        res.status(500).send(err);
    })
});

router.put('/:id', auth.isLoggedIn, function (req, res) {
    if (req.user.id == req.params.id || req.user.admin) {
        if (!req.user.admin) {
            delete req.body.admin;
        }
        User.updateById(req.params.id, req.body)
        .then(function (result) {
            if (result.affectedRows) {
                // Found user and did something
                res.send(result.info);
            } else {
                res.status(404).send("Did not find user with id: " + req.params.id);
            }
        })
        .catch(function (err) {
            if (err.errno == 1062) {
                // Duplicate entry
                res.status(409).send("There is already an user with that username or email.");
            }
            res.status(500).send(err);
        });
    } else {
        res.status(401).send("You are not allowed to edit this user.");
    }
});

router.delete('/:id', auth.isLoggedIn, function (req, res) {
    if (req.user.id == req.params.id || req.user.admin) {
        User.deleteById(req.params.id)
        .then(function (result) {
            if (result.affectedRows) {
                // Found user and deleted it
                res.send(result.info);
            } else {
                res.status(404).send("Did not find user with id: " + req.params.id);
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
    } else {
        res.status(401).send("You are not allowed to delete this user.");
    }
});

module.exports = router;