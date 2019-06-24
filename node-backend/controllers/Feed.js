// DB for post
const db = require('../dbConnection');

const Feed = {  
    /**
     * Get userid's feed
     * @param {number} userId
     * @return {promise}
     */
    getByUserId: function (userId) {
        const sql = `
        SELECT p.id AS post_id, p.description AS post_description, p.img_id,
                p.added, f.username AS post_username, uf.user_id AS post_user_id,
                (SELECT COUNT(*) FROM post_like AS pl WHERE pl.post_id = p.id) AS post_likes
        FROM user_follow AS uf
        INNER JOIN user AS f ON f.id = uf.follow_id
        INNER JOIN post AS p ON p.user_id = uf.follow_id
        WHERE uf.user_id = ?
        ORDER BY p.added DESC
        LIMIT 0, 20
        `;
        return db.query(sql, userId);
    }
};

module.exports = Feed;