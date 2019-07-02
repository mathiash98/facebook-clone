// API for chat
const knex = require('../dbConnection');

const Chat = {  
    /**
     * Find chats
     * @param {object} query
     * @return {promise}
     */
    find: function (query) {
        // Add security to check if user is friend
        let q = knex.select('m.*')
                .from('messages AS m');
        if (query) {
            if (query.userId && query.friendId) {
                q.where('m.from_user_id', query.userId)
                .andWhere('m.to_user_id', query.friendId)
                .orWhere('m.from_user_id', query.friendId)
                .andWhere('m.to_user_id', query.userId);
            } else {
                if(query.userId) q.where('m.from_user_id', query.userId);
                if(query.friendId) q.where('m.to_user_id', query.friendId);
            }
        }
        q.orderBy('m.created_at', 'asc');
        // console.log(q.toString());
        return q;
    },

    /**
     * Save a chat message
     * @param {number} userId Current user
     * @param {number} friendId Recipients id
     * @param {string} message
     * @return {promise}
     */
    save: function (userId, friendId, message) {
        // Add a method to check if user can send message to user
        console.log({
            from_user_id: userId,
            to_user_id: friendId,
            message, message
        });
        return knex('messages').insert({
            from_user_id: userId,
            to_user_id: friendId,
            message, message
        });
    }
};

module.exports = Chat;