const config = require('./knexfile.js');
const knex = require('knex')(config);
const grpc = require('@grpc/grpc-js');

const getAllPosts = (call, callback) => {
    knex('co_posts')
        .then((data) => {
            callback(null, { posts: data });
        });
};

const getAllPostsByImpacterId = (call, callback) => {
    knex('co_posts')
        .where({ impacter_id: parseInt(call.request.impacter_id) })
        .then((data) => {
            if (data.length) {
                callback(null, { posts: data });
            } else {
                callback('no post for the given impacter id found.');
            }
        });
};

const getPost = (call, callback) => {
    knex('co_posts')
        .where({ post_id: parseInt(call.request.post_id) })
        .then((data) => {
            if (data.length) {
                callback(null, data[0]);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: "Post Not Found",
                });
            }
        });
};

const createPost = (call, callback) => {
    const response = {
        post_id: Math.floor(1000 + Math.random() * 9000),
        ...call.request.description ? { description: call.request.description } : {},
        ...call.request.type ? { type: call.request.type } : {},
        ...call.request.status ? { status: call.request.status } : {},
        ...call.request.impacter_id ? { impacter_id: call.request.impacter_id } : {},
        ...call.request.reaction_count ? { reaction_count: call.request.reaction_count } : {},
        ...call.request.data ? { data: call.request.data } : {},
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString()
    }
    console.log(response)
    knex('co_posts')
        .insert(response)
        .returning()
        .then((data) => {
            if (data.rowCount == 1) {
                callback(null, response);
            } else {
                callback('failed to create new post.');
            }
        });
};

const updatePost = (call, callback) => {
    knex('co_posts')
        .where({ post_id: parseInt(call.request.post_id) })
        .update({
            ...call.request.description ? { description: call.request.description } : {},
            ...call.request.type ? { type: call.request.type } : {},
            ...call.request.status ? { status: call.request.status } : {},
            ...call.request.impacter_id ? { impacter_id: call.request.impacter_id } : {},
            ...call.request.reaction_count ? { reaction_count: call.request.reaction_count } : {},
            ...call.request.data ? { data: call.request.data } : {},
            updated_at: new Date().toUTCString()
        })
        .returning()
        .then((data) => {
            if (data) {
                callback(null, { status: 'success' });
            } else {
                callback('no post for the given post id found.');
            }
        });
};

const deletePost = (call, callback) => {
    knex('co_posts')
        .where({ post_id: parseInt(call.request.post_id) })
        .delete()
        .returning()
        .then((data) => {
            if (data) {
                callback(null, { status: 'success' });
            } else {
                callback('no post for the given post id found.');
            }
        });
}

module.exports = {
    getAllPosts,
    getAllPostsByImpacterId,
    getPost,
    createPost,
    updatePost,
    deletePost
};