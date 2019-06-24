// Post API stuff
const sharp = require('sharp');
const stream = require('stream');
// const streamToArray = require('stream-to-array');
const express = require('express');
const router = express.Router();

const Img = require('../../controllers/Img');
const Post = require('../../controllers/Post');

const auth = require('../utilities/authMiddleware');

router.get('/', function (req, res) {
    // Get posts
    let query = {};
    query.user_id = (req.user ? req.user.id : 0);
    console.log(req.user);
    console.log(req.user ? req.user.id : 0);
    Post.get(query)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

router.get('/:id', function (req, res) {
    // Get posts
    Post.get(req.params.id)
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
    req.pipe(req.busboy); // Pipe the request into busboy
    // All files and fields will enter here
    const result = {
        files: []
    };
    let files = 0; // Counter to make sure all img processing is done before busboy runs finished
    let finished = false;
    // Input files
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        ++files;
        const tmp = {
            file: []
        };

        // Pipe data from client through resize, then to buffer (result array)
        // streamToArray(file.pipe(sharp().resize({
        //         width: 1000,
        //         height: 1000,
        //         fit: sharp.fit.inside,
        //         withoutEnlargement: true
        //     })))
        //     .then((parts) => {
        //         const buffers = parts.map(part => Buffer.isBuffer(part) ? part : Buffer.from(part));

        //         tmp.file = Buffer.concat(buffers);
        //         tmp.filename = filename;
        //         tmp.encoding = encoding;
        //         tmp.mimetype = mimetype;
        //         tmp.size = tmp.file.length;
        //         result.files.push(tmp);

        //         if (--files === 0 && finished) {
        //             // All images has been downloaded and processed, now write to mariadb
        //             writeToDatabase();
        //         }
        //     });
    });
    // Read fields from request
    req.busboy.on('field', (fieldname, val) => {
        result[fieldname] = val;
    });
    // If error 
    req.busboy.on('error', (error) => {
        console.log(error);
        res.status(500).send(error);
    });
    // Busboy is done parsing files and fields
    req.busboy.on('finish', () => {
        finished = true;
    });

    /**
     * Runs after all images have been processed
     * Save images to database
     * Save post to database with img ids.
     */
    function writeToDatabase() {
        // TODO: enable multiple image uploads
        Img.save(result.files[0])
            .then((rows, fields) => {
                const img_id = rows.insertId;

                Post.save({
                        user_id: req.user.id,
                        description: result.description,
                        img_id: img_id
                    })
                    .then((rows, fields) => {
                        // Successfully saved img
                        res.status(201).send(rows);
                    })
                    .catch((error) => {
                        // Error while adding post, delete img
                        Img.deleteById(img_id)
                            .then((rows, fields) => {
                                res.status(500).send(error);
                            })
                            .catch((error2) => {
                                console.log(error2);
                                res.status(500).send(error2);
                            });
                    });
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    }
});

router.get('/:id/likes', function (req, res) {
    // TODO: fix this
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
    Post.like(req.user.id, req.params.id)
    .then((results, fields) => {
        console.log(results, fields);
        res.json(results[0]);
    })
    .catch(err => {
        if (err.errno == 1062) {
            // Already following user
            res.send();
        } else {
            res.status(500).send(err); 
        }
    });
});

router.post('/:id/unlike', auth.isLoggedIn, function (req, res) {
    Post.unlike(req.user.id, req.params.id)
    .then((results, fields) => {
        console.log(results, fields);
        res.json(results[0]);
    })
    .catch(err => {
        res.status(500).send(err); 
    });
});

module.exports = router;