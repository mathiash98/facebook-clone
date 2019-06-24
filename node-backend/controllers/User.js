// DB for post
const bcrypt = require('bcrypt');
const saltRounds = 11;
const knex = require('../dbConnection');

const User = {
    /**
     * find all based on query
     * @typedef {Object} User
     * @property {number} id
     * @property {string} first_name
     * @property {string} last_name
     * @property {string} email
     * @property {string} password Hashed
     * @property {Date} birth
     * @property {timestamp} created_at
     * @property {timestamp} updated_at
     * 
     * @param {object} query 
     * @returns {Knex.QueryBuilder<User, {}>}
     */
    find: function (query) {
        let q = knex.select('id', 'first_name', 'last_name', 'birth', 'created_at', 'admin');
        let builder = {};
        if (query) {
            if (query.id) builder.id = query.id;
            if (query.first_name) builder.first_name = query.first_name;
            if (query.last_name) builder.last_name = query.last_name;
            if (query.email) builder.email = query.email;
            if (query.admin) builder.admin = query.admin;
            
            if (query.limit) q.limit(query.limit);
            if (query.orderBy) q.orderBy(query.orderBy);
        }
        
        q.from('users')
        q.where(builder)
        
        return q;
    },
    
    /**
     * Find specific user by id
     * @param {number} id 
     */
    findById: function (id) {
        return new Promise(async function(resolve, reject) {
            this.find({id: id});
        });
    },

    /**
     * Save a new user from data object.
     * @param {object} data
     * @return {promise} user object
     */
    save: function (data) {
        let self = this;
        return new Promise(async function(resolve, reject) {
            try {
                self.hash(data.password)
                    .then(async (hash) => {
                        const newUser = {
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email,
                            birth: data.birth,
                            password: hash
                        };
                        knex('users')
                        .insert(newUser)
                        .then((result) => {
                            console.log(result);
                            resolve(result[0]);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Update user by id from data object.
     * @param {number} id
     * @param {object} data
     * @return {promise}
     */
    updateById: function (id, data) {
        const self = this;
        return new Promise(async function (resolve, reject) {
            try {
                let editedUser = {};
                if (data.username) {
                    editedUser.username = data.username;
                }
                if (data.email) {
                    editedUser.email = data.email;
                }
                if (data.password) {
                    editedUser.password = await self.hash(data.password);
                }
                if (data.admin) {
                    editedUser.admin = data.admin;
                }
                db.query('UPDATE `user` SET ? WHERE id = ?', [editedUser, id])
                    .then(function (result) {
                        resolve(result[0]);
                    })
                    .catch((err) => {
                        reject(err);
                    });
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
     * Get followers by userid.
     * @param {number} id
     * @return {promise}
     */
    getFollowersById: function (id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.username AS user_username, u.id AS user_id, f.username AS follower_username, f.id AS follower_id
                FROM user_follow AS uf
                JOIN user AS u on u.id = uf.user_id
                JOIN user AS f on f.id = uf.follow_id
                WHERE uf.follow_id = ?
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
     * Get following by userid.
     * @param {number} id
     * @return {promise}
     */
    getFollowingById: function (id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.username AS user_username, u.id AS user_id, f.username AS follower_username, f.id AS follower_id
                FROM user_follow AS uf
                JOIN user AS u on u.id = uf.user_id
                JOIN user AS f on f.id = uf.follow_id
                WHERE uf.user_id = ?
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
     * Follow followId from userId
     * @param {number} userId 
     * @param {number} followId 
     * @return {promise}
     */
    follow: function (userId, followId) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO user_follow SET user_id = ?, follow_id = ?', [userId, followId])
            .then((results, fields) => {
                resolve(results, fields);
            })
            .catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * Unfollow followId from userId
     * @param {number} userId 
     * @param {number} followId 
     * @return {promise}
     */
    unfollow: function (userId, followId) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM user_follow WHERE user_id = ? AND follow_id = ?', [userId, followId])
            .then((results, fields) => {
                resolve(results, fields);
            })
            .catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * Hash a password with bcrypt.
     * @param {string} password 
     * @return {promise} bcrypt promise
     * @throws error
     */
    hash: async function (password) {
        console.log(password, saltRounds);
        return await bcrypt.hash(password, saltRounds);
    },

    /**
     * Check email and password, throws error if false email, password, etc.
     * @param {string} email 
     * @param {string} password 
     * @return {promise} user object
     */
    comparePassword: function (email, password) {
        let self = this;
        return new Promise(async function(resolve, reject) {
            try {
                knex('users')
                .where({email: email})
                .then(rows => {
                    if (rows[0]) {
                        let user = rows[0];
                        console.log(user);
                        self.comparePasswordHash(password, user.password)
                            .then((res) => {
                                if (res) {
                                    resolve(user);
                                } else {
                                    reject({message: "Password is wrong"});
                                }
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else {
                        // TODO: Change error message to look like mysql2 error
                        reject({message: "Did not find email"});
                    }
                })
            } catch (error) {
                reject(error);     
            }
        });
    },
    
    /**
     * Compare password with hash, throws error if error
     * @param {string} password 
     * @param {string} hash 
     * @return {boolean} True if correct password, false if not
     */
    comparePasswordHash: async function (password, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
};

module.exports = User;