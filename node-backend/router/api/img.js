// Post API stuff
console.log("Hello from api post.js");
const express = require('express');
const router = express.Router();

const Img = require('../../controllers/Img');

// Implement some security
router.get('/:id', function (req, res) {
    Img.getById(req.params.id)
    .then((row, field) => {
        res.setHeader('Content-Type', row.mimetype);
        res.setHeader('Content-Length', row.size);
        res.send(row.img);
    })
    .catch((error) => {
        res.status(500).send(error);
    });
});

module.exports = router;