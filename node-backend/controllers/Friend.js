// DB for friends
const knex = require('../dbConnection');

const Friend = {
    /**
     * Find all friends based on query
     * @param {object} query 
     */
    find: function (query) {
        let q = knex.select('u.first_name', 'u.last_name', 'u.id', 'u.avatar')
        .from('friends AS f')
        .innerJoin('users AS u', 'u.id', 'f.friend_id')
        .orderBy('u.first_name', 'asc');
        if (query.userId) q.where('f.user_id', query.userId).orWhere('f.friend_id', query.userId);
        // console.log(q.toString());
        return q;
    },
    
    /**
     * Find friends to userId
     * @param {number} id 
     */
    findByUserId: function (userId) {
        return this.find({userId: userId});
    },

    /**
     * Insert a new friendship
     * @param {number} userId 
     * @param {number} friendId 
     */
    save: function (userId, friendId) {
        return knex('friends')
        .insert([
            {
                user_id: userId,
                friend_id: friendId
            }, {
                user_id: friendId,
                friend_id: userId
            }
        ]);
    },

    /**
     * Delete specific friendship, based on userId and friendId
     * @param {number} userId 
     * @param {number} friendId 
     */
    delete: function (userId, friendId) {
        return knex('friends')
        .where({
            user_id: userId,
            friend_id: friendId
        })
        .orWhere({
            user_id: friendId,
            friend_id: userId
        }).del();
    }
};

module.exports = Friend;