// DB for post
const knex = require('../dbConnection');

const Post = {
    /**
     * find all based on query
     * @param {object} query 
     * @returns {Promise}
     */
    find: async function(query) {
        console.log(query);
        let q = knex.select('p.*', 'u.first_name', 'u.last_name', 'u.avatar');
        q.select(knex.raw('GROUP_CONCAT(pi.medium) AS images')); // Group the ids of post_images
        q.leftJoin('post_images AS pi', 'pi.post_id', 'p.id'); // Left join to get the images of the post
        q.countDistinct('pl.user_id AS likes_num');
        q.countDistinct('pc.id AS comments_num');
        q.from('posts AS p');
        q.leftJoin('post_likes AS pl', 'p.id', 'pl.post_id');
        q.leftJoin('post_comments AS pc', 'p.id', 'pc.post_id');
        q.innerJoin('users AS u', 'u.id', 'p.user_id');
        if(query) {
            if(query.id) q.where('p.id', query.id);
            if(query.user_id) q.where('p.user_id', query.user_id);
            if(query.orderBy) q.orderBy(query.orderBy);
            else q.orderBy('p.created_at', 'desc');
            if(query.limit) q.limit(Number(query.limit));
            if(query.reqUserId) {
                // If reqUserId is supplied, find posts made by friends of reqUserId
                // reqUserId == the user who requested posts (req.user.id)

                // Check if req.user.id has liked the post
                q.select(knex.raw('EXISTS(SELECT user_id FROM post_likes WHERE post_id = p.id AND user_id = ?) AS liked', [query.reqUserId]));
                
                // Find posts where req.user is friend with poster
                const friendsQuery = knex.select('friend_id')
                                .from('friends')
                                .where({'user_id': query.reqUserId});
                q.whereIn('p.user_id', friendsQuery);
            }
        }
        q.groupBy('p.id')

        // console.log(q.toString());
        
        return q;
    },

    /**
     * Find by id
     * @param {number} id
     * @returns {Array} Returns array of elements with same id.
     *                              So you have to select the first element
     */
    getById: async function(id) {
        return this.find({id: id});
    },

    /**
     * Get by user id
     * @param {number} user_id
     * @param {number} poster_user_id
     * @returns {Promise} Array of posts made by poster_user_id
     */
    getByUserId: async function(user_id, poster_user_id) {
        return this.find({
            user_id: poster_user_id
        });
    },

    /**
     * Save a new post
     * @param {object} data 
     */
    save: async function (data) {
        return new Promise(async function (resolve, reject) {
            const newPost = {
                user_id: data.userId,
                text: (data.text ? data.text : null)
            };
            knex.transaction(trx => {
                knex.transacting(trx)
                .insert(newPost)
                .into('posts')
                .then(ids => {
                    if (data._images) {
                        data._images.forEach(image => {
                            image.post_id = ids[0];
                            image.small = image.small.toString();
                            image.medium = image.medium.toString();
                            image.large = image.large.toString();
                        });
                        console.log(data._images);
                        return knex('post_images')
                                .insert(data._images)
                                .transacting(trx);
                    }
                })
                .then(trx.commit)
                .catch(trx.rollback);                
            })
            .then(inserts => {
                resolve(inserts);
            })
            .catch(err => {
                reject(err);
            });
        });
    },

    /**
     * Delete by id.
     * @param {number} id
     * @return {promise}
     */
    deleteById: function (id) {
        return knex('posts').where('id', id).del();
    },

    /**
     * Get images to post
     * @param {number} postId
     * @return {promise}
     */
    getImagesById: function (postId) {
        return knex
                .from('post_images AS pi')
                .where('pi.post_id', postId);  
    },

    /**
     * Get all the users who liked a post
     * @param {number} id
     * @return {promise}
     */
    getLikesById: function (id) {
        return knex.select('u.first_name', 'u.last_name', 'u.id', 'pl.created_at')
                .from('post_likes AS pl')
                .innerJoin('users AS u', 'u.id', 'pl.user_id')
                .where('pl.post_id', id);
    },

    /**
     * Like postId
     * @param {number} postId
     * @param {number} userId
     * @return {promise}
     */
    like: function (postId, userId) {
        return knex('post_likes').insert({
            post_id: postId,
            user_id: userId
        });
    },

    /**
     * Unlike postId
     * @param {number} postId
     * @param {number} userId
     * @return {promise}
     */
    unlike: function (postId, userId) {
        return knex('post_likes').where({
            user_id: userId,
            post_id: postId
        }).del();
    },

    /**
     * Comment on post with postId
     * @param postId
     * @param userId
     * @param comment
     * @returns {Promise}
     */
    comment: function (postId, userId, comment) {
        return knex('post_comments').insert({
            post_id: postId,
            user_id: userId,
            comment: comment
        });
    },

    /**
     * Get comments on post
     * @param {number} postId
     * @param {number} [reqUserId]
     * @returns {Promise}
     */
    getCommentsByPostId: function (postId, reqUserId) {
        let q = knex.select('pc.*', 'u.first_name', 'u.last_name')
                .from('post_comments AS pc')
                .countDistinct('pcl.user_id AS likes_num')
                .leftJoin('post_comment_likes AS pcl', 'pcl.post_comment_id', 'pc.id')
                .innerJoin('users AS u', 'u.id', 'pc.user_id')
                .where({
                    post_id: postId
                })
                q.groupBy('pc.id');
        
        // Check if user has liked the comment
        if (reqUserId) q.select(knex.raw('EXISTS(SELECT user_id FROM post_comment_likes WHERE post_comment_id = pc.id AND user_id = ?) AS liked', [reqUserId]));

        return q;
    },

    /**
     * Delete comment on post by id and userid
     * @param commentId
     * @param userId
     * @returns {Promise}
     */
    deleteCommentById: function (commentId, userId) {
        return knex('post_comments').where({
            id: commentId,
            user_id: userId
        }).del();
    },

    /**
     * Like Comment
     * @param {number} commentId
     * @param {number} userId
     * @return {promise}
     */
    likeComment: function (commentId, userId) {
        return knex('post_comment_likes').insert({
            post_comment_id: commentId,
            user_id: userId
        });
    },

    /**
     * Unlike Comment
     * @param {number} commentId
     * @param {number} userId
     * @return {promise}
     */
    unlikeComment: function (commentId, userId) {
        return knex('post_comment_likes').where({
            post_comment_id: commentId,
            user_id: userId
        }).del();
    },
};

module.exports = Post;