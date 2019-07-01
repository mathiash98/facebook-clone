const mongodb = require('mongodb');

const config = require('../config');

const MongoClient = mongodb.MongoClient;

let gfs;
let db;
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
        console.log('connected to mongodb');
        if (client) {
            db = client.db(config.db.mongodb.dbName);
            gfs = new mongodb.GridFSBucket(db);
        }
    }
});

const Img = {
    /**
     * Get all based on query
     * @param {object} query 
     */
    get: function (query) {
        return gfs.find(query, {
            limit: 100
        });
    },
    
    /**
     * Get specific img by id
     * @param {number} id 
     * @returns {promise}
     */
    getById: function (id) {
        return new Promise(function (resolve, reject) {
            console.log('starting to find', id);
            db.collection('fs.files').findOne({_id: mongodb.ObjectID(id)}, function (err, file) {
                if (err || !file) {
                    reject(err);
                } else {
                    resolve({
                        ...file,
                        downloadStream: gfs.openDownloadStream(mongodb.ObjectID(id))
                    });
                }
            });
        })
    },

    /**
     * Delete specific img with specific id
     * @param {number} id 
     * @returns {promise}
     */
    deleteById: function (id) {
        return new Promise(async function(resolve, reject) {
            gfs.delete(id, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve('Deleted id: ' + id);
                }
            });
        });
    }
};

module.exports = Img;