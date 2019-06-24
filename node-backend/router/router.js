const router = require('express').Router();
const passport = require('passport');

const api = require('./api/api');
const auth = require('./auth/auth');

require('./auth/passport');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
});

router.use(function (req, res, next) {
     passport.authenticate('jwt', { session: false }, async function (err, jwtData) {
         if(jwtData) {
             req.user = jwtData.data;
             console.info("Auth user:", req.user);
        }
        next();
     })(req, res, next);
});

router.use('/api', api);
router.use('/auth', auth);

module.exports = router;