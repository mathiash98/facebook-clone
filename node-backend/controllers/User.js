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
        let q = knex.select('u.id', 'u.first_name', 'u.last_name', 'u.birth', 'u.created_at', 'u.admin', 'u.avatar');
        let builder = {};
        if (query) {
            if (query.q) q.whereRaw('MATCH(u.first_name, u.last_name) AGAINST(? IN BOOLEAN MODE)', [(query.q+'*').replace(' ', '* ')]); // Free text search
            if (query.id) q.where('u.id', query.id);
            if (query.first_name) q.where('u.first_name', query.first_name);
            if (query.last_name) q.where('u.last_name', query.last_name);
            if (query.email) q.where('u.email', query.email);
            if (query.admin) q.where('u.admin', query.admin);
            if (query.reqUserId) q.select(knex.raw('EXISTS(SELECT friend_id FROM friends WHERE friend_id = u.id AND user_id = ?) AS friend', [query.reqUserId]));
            
            (query.limit ? q.limit(query.limit) : q.limit(10));
            if (query.orderBy) q.orderBy(query.orderBy);
        }
        
        q.from('users AS u')
        q.where(builder)
        // console.log(q.toString());
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
                        knex.transaction((trx) => {
                            return trx('users')
                            .insert(newUser)
                            .then((ids) => {
                                const userId = ids[0]; // inserted row id
                                return trx('friends')
                                .insert({
                                    user_id: userId,
                                    friend_id: userId
                                })
                                .then(data => {
                                    console.log("Friend:", data);
                                    resolve(userId);
                                });
                            })

                        })
                        .then(inserts => {
                            console.log("Inserts", inserts);
                            resolve(inserts);
                        })
                        .catch(err => {
                            console.error(err);
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
        return knex('users AS u')
                .where('u.id', id)
                .update(data);
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