// DB for post
const db = require('../dbConnection');

const Img = {
    /**
     * Get all based on query
     * @param {object} query 
     */
    get: function (query) {
        return new Promise(async function(resolve, reject) {
            try {
                const [rows, fields] = await db.query('SELECT id, username, email, added FROM `user`');
                resolve(rows, fields);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    /**
     * Get specific img by id
     * @param {number} id 
     */
    getById: function (id) {
        return new Promise(async function(resolve, reject) {
            try {
                const [rows, fields] = await db.query('SELECT * FROM `img` WHERE `id` = ?', [id]);
                resolve(rows[0], fields[0]);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Save a new img from data object.
     * @param {object} data 
     */
    save: function (data) {
        return new Promise(async function(resolve, reject) {
            try {
                const [rows, fields] = await db.query('INSERT INTO `img` SET ?', {img: data.file, size: data.size, filename: data.filename, encoding: data.encoding, mimetype: data.mimetype});
                resolve(rows, fields);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Delete specific img with specific id
     * @param {number} id 
     */
    deleteById: function (id) {
        return new Promise(async function(resolve, reject) {
            try {
                const [rows, fields] = await db.query('DELETE FROM `img` WHERE `id` = ?', [id]);
                resolve(rows, fields);
            } catch (error) {
                reject(error);
            }
        });
    }
};

module.exports = Img;