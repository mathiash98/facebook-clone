// DB for post
const db = require('../dbConnection');

const Post = {
    /**
     * Get posts from query
     * @param {object} [query] 
     */
    get: async function(query) {
        // TODO: Query builder
        let sql = `
        SELECT p.*, u.username, COUNT(pl.post_id) AS likes, EXISTS(
            SELECT user_id FROM post_like WHERE post_id = p.id AND user_id = ?
            ) AS liked
        FROM post AS p
        INNER JOIN user AS u
            ON u.id = p.user_id
        LEFT JOIN post_like AS pl
            ON pl.post_id = p.id
        GROUP BY p.id
        ORDER BY p.added DESC
        `;
        let builder = {};
        if (Object.keys(query).length) {
            if (query.hasOwnProperty("user_id")) {
                builder.user_id = query.user_id;
            } else {
                throw "Must have user_id in query.";
            }
        } else {
            throw "Query is empty.";
        }
        let sql2 = db.format(sql, [query.user_id]);
        return new Promise(async function (resolve, reject) {
            try {
                const [rows, fields] = await db.query(sql, [builder.user_id]);
                resolve(rows, fields);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    /**
     * Get by id
     * @param {number} id 
     */
    getById: async function(id) {
        // Going to change to this style 
        // let query = {id: id, limit: 1};
        // return this.get(query);
        return new Promise(async function (resolve, reject) {
            try {
                const [rows, fields] = await db.query('SELECT * FROM `post` WHERE `post.id` EQUALS ?', [id]);
                resolve(rows[0], fields[0]);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Get by user id
     * @param {number} user_id
     * @param {number} poster_user_id
     */
    getByUserId: async function(user_id, poster_user_id) {
        let sql = `
        SELECT p.*, u.username, COUNT(pl.post_id) AS likes, EXISTS(
            SELECT user_id FROM post_like WHERE post_id = p.id AND user_id = ?
            ) AS liked
        FROM post AS p
        INNER JOIN user AS u
            ON u.id = p.user_id
        LEFT JOIN post_like AS pl
            ON pl.post_id = p.id
        WHERE p.user_id = ?
        GROUP BY p.id
        ORDER BY p.added DESC
        `;

        return new Promise(async function (resolve, reject) {
            try {
                const [rows, fields] = await db.query(sql, [user_id, poster_user_id]);
                resolve(rows, fields);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    /**
     * Save a new post
     * @param {object} data 
     */
    save: async function (data) {
        console.log('Saving post');
        return new Promise(async function (resolve, reject) {
            try {
                const [rows, fields] = await db.query('INSERT INTO `post` SET ?', {user_id: data.user_id, description: data.description, img_id: data.img_id});
                resolve(rows, fields);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Delete user by id.
     * @param {number} id
     * @return {promise}
     */
    deleteById: function (id) {
        return new Promise(function (resolve, reject) {
            db.query('DELETE FROM `user` WHERE id = ?', id)
                .then(result => {
                    resolve(result[0]);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },

    /**
     * Get likes on postid.
     * @param {number} id
     * @return {promise}
     */
    getLikesById: function (id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.id AS post_id, u.username AS like_username, u.id AS like_user_id
                FROM post_like AS pl
                INNER JOIN user AS u
                    ON u.id = pl.user_id
                WHERE pl.post_id = ?
            `;
            console.log(db.format(sql, id));
            db.query(sql, id)
            .then((results, fields) => {
                resolve(results[0], fields);
            })
            .catch(err => {
                reject(err);
            })
        });
    },

    /**
     * Like postId
     * @param {number} userId 
     * @param {number} postId 
     * @return {promise}
     */
    like: function (userId, postId) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO post_like SET user_id = ?, post_id = ?', [userId, postId])
            .then((results, fields) => {
                resolve(results, fields);
            })
            .catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * Unlike postId
     * @param {number} userId 
     * @param {number} postId 
     * @return {promise}
     */
    unlike: function (userId, postId) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM post_like WHERE user_id = ? AND post_id = ?', [userId, postId])
            .then((results, fields) => {
                resolve(results, fields);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
};

module.exports = Post;