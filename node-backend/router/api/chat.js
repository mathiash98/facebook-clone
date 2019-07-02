// Feed API stuff
const express = require('express');
const router = express.Router();

const Chat = require('../../controllers/Chat');
const Friend = require('../../controllers/Friend');

const auth = require('../utilities/authMiddleware');

// Chat
router.get('/:friendId', auth.isLoggedIn, function (req, res) {
    Friend.findByUserId(req.params.friendId)
            .then(friends => {
                console.log(friends);
                if(friends.filter(friend => friend.id == req.params.friendId).length > 0) {
                    Chat.find({userId: req.user.id, friendId: req.params.friendId})
                    .then((results) => {
                        res.json(results);
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send(err);
                    });
                }  else {
                    res.status(401).send('You are not allowed to view this chat');
                }
            })
            .catch(err => {
                res.status(500).send(err);
            });
});

// Sending messages is handled with socket.io
// router.post('/:friendId', auth.isLoggedIn, function (req, res) {
//     Chat.save(req.user.id, req.params.friendId, req.body.message)
//     .then((results) => {
//         res.json(results);
//     })
//     .catch(err => {
//         res.status(500).send(err);
//     });
// });

module.exports = router;