// Post API stuff
console.log("Hello from api post.js");
const express = require('express');
const router = express.Router();

const Img = require('../../controllers/Img');

// Implement some security
router.get('/:id', function (req, res) {
    Img.getById(req.params.id)
    .then(file => {
        res.set('Content-Type', file.contentType);
        res.set('Content-Length', file.length);
        file.downloadStream.on('data', (chunk) => {
            res.write(chunk);
        })
        file.downloadStream.on('error', (err) => {
            console.error(err)
            res.status(500).send(err);
        })
        file.downloadStream.on('end', () => {
            res.end();
        });
    })
    .catch(err => {
        if (err) {
            console.error(err)
            res.status(500).send(err);
        } else {
            res.status(404).send('Could not find image.');
        }
    });
});

module.exports = router;