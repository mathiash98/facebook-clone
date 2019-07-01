const sharp = require('sharp');
const async = require('async');
const mongodb = require('mongodb');

const config = require('../config');

const MongoClient = mongodb.MongoClient;

let gfs;
MongoClient.connect(config.db.mongodb.uri, {
    useNewUrlParser: true,
    poolSize: 10,
    autoReconnect: true,
    // retry to connect for 60 times
    reconnectTries: 60,
    // wait 1 second before retrying
    reconnectInterval: 1000
}, function(err, client) {
    if(err) {
        console.error(err);
    } else {
        console.log('Connected to mongodb');
        if (client) {
            const db = client.db(config.db.mongodb.dbName);
            gfs = new mongodb.GridFSBucket(db);
        }
    }
});


module.exports = function (req, res, next) {
    if (req.is('multipart/form-data')) {
        console.log('Got multipart');
        let numFiles = 0;
        let _images = [];
        req.busboy.on('file', (fieldname, fileStream, filename, encoding, mimetype) => {
            numFiles++;
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            if(filename !== '') {
                const wStreamOptions = {
                    contentType: 'image/jpeg',
                    metadata: {
                        fieldname: fieldname,
                        user_id: req.user.id,
                        encoding: encoding,
                        size: 'large'
                    }
                };
                async.parallel({
                    large: (done) => {
                        const transformer = sharp()
                        .resize({
                            width: 3000,
                            height: 3000,
                            fit: sharp.fit.inside,
                            withoutEnlargement: true
                        })
                        .toFormat('jpeg');
                        const options = {...wStreamOptions};
                        options.metadata.size = 'large';
                        console.log('============', options);
                        const uploadStream = gfs.openUploadStream(filename, options);
                        fileStream.pipe(transformer).pipe(uploadStream)
                        .once("finish", function() {
                            console.log("writestream-file-close raw", Date.now());
                            return done(null, uploadStream.id);
                        });
                    },
                    medium: (done) => {
                        const transformer = sharp()
                        .resize({
                            width: 900,
                            height: 900,
                            fit: sharp.fit.inside,
                            withoutEnlargement: true
                        })
                        .toFormat('jpeg');
                        const options = {...wStreamOptions};
                        options.metadata.size = 'medium';
                        const uploadStream = gfs.openUploadStream(filename, options);
                        fileStream.pipe(transformer).pipe(uploadStream)
                        .once("finish", function() {
                            console.log("writestream-file-close raw", Date.now());
                            return done(null, uploadStream.id);
                        });
                    },
                    small: (done) => {
                        const transformer = sharp()
                        .resize({
                            width: 256,
                            height: 256,
                            fit: sharp.fit.inside,
                            withoutEnlargement: true
                        })
                        .toFormat('jpeg');
                        const options = {...wStreamOptions};
                        options.metadata.size = 'small';
                        const uploadStream = gfs.openUploadStream(filename, options);
                        fileStream.pipe(transformer).pipe(uploadStream)
                        .once("finish", function() {
                            console.log("writestream-file-close raw", Date.now());
                            return done(null, uploadStream.id);
                        });
                    }
                }, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    _images.push(results);
                    numFiles--;
                    if (numFiles === 0) {
                        req.user.fileCacheTime = Date.now();
                        console.log("busboy-finish");
                        req.body._images = _images;
                        next();
                    }
                });
            } else {
                next();
            }
        });
    
        req.busboy.on('field', (fieldname, value, keyTruncated, valueTruncated) => {
            req.body[fieldname] = value;
        });
        req.busboy.on('finish',function(){
            if (numFiles === 0) {
                console.log("busboy-finish");
                req.body._images = _images;
                next();
            } else {
            }
        });


        req.pipe(req.busboy); // Pipe the request to busboy
    } else {
        // Not multipart content-type
        next();
    }
};