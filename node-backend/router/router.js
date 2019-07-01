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

// Parser for multipart/form-data for uploading images to mongodb gfsBucket
// Have to import it here, after passport to be able to use req.user.id
router.use(require('../utils/busboyParser'));

router.use('/api', api);
router.use('/auth', auth);

module.exports = router;