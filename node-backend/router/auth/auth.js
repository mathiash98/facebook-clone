// Authentication is done through here
const passport = require('passport');
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const config = require('../../config');
const User = require('../../controllers/User');

require('./passport');

/**
 * Sign jwt token with secret from config.jwt.secret
 * Expires in 24 hours
 * @param {object} user 
 * @return {string} JWT-token
 */
async function jwtSign(user) {
    return await jwt.sign({
        data: {id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, admin: user.admin}
    }, config.jwt.secret, {expiresIn: 24*60*60});
}

router.post('/local-login', function (req, res) {
    console.log(req.body);
    passport.authenticate('local-login', {session: false}, async function (err, user) {
        if (err || !user) {
            if (err && err.message) {
                res.status(400).send(err.message);
            } else if(!user) {
                res.status(400).send('Could not find user.');
            } else {
                res.status(500).send(err);
            }
        } else {
            console.log(user);
            const token = await jwtSign(user);
            res.send(token);
        }
    })(req, res);
});

router.post('/local-signup', function (req, res) {
    User.save(req.body)
        .then(async (id) => {
            User.find({id: id})
            .then(async users => {
                try {
                    const token = await jwtSign(users[0]);
                    res.send(token);
                } catch (error) {
                    res.status(500).send(error);
                }
            })
        })
        .catch((err) => {
            if (err.errno == 1062) {
                res.status(409).send("There is already an user with that username or email.");
            }
            console.log(err);
            res.status(500).send(err);
        });
});

module.exports = router;