// Feed API stuff
const express = require('express');
const router = express.Router();

const Feed = require('../../controllers/Feed');

const auth = require('../utilities/authMiddleware');

// Feed
router.get('/', auth.isLoggedIn, function (req, res) {
    Feed.getByUserId(req.user.id)
    .then((results) => {
        res.json(results[0]);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

module.exports = router;