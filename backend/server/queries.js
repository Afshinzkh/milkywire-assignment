const config = require('./knexfile.js');
const knex = require('knex')(config);
const grpc = require('@grpc/grpc-js');

const getAllPosts = (call, callback) => {
    knex('co_posts')
        .then((data) => {
            if (data.length) {
                callback(null, { posts: data });
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: "No Posts found on the table",
                });
            }
        }).catch((err) => {
            console.log(err)
            callback({
                code: grpc.status.UNIMPLEMENTED,
                message: "unknown error",
            });
        });
};

const getAllPostsByImpacterId = (call, callback) => {
    knex('co_posts')
        .where({ impacter_id: parseInt(call.request.impacter_id) })
        .then((data) => {
            if (data.length) {
                callback(null, { posts: data });
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: "Post Not Found for the given impact id",
                });
            }
        }).catch((err) => {
            console.log(err)
            callback({
                code: grpc.status.UNIMPLEMENTED,
                message: "unknown error",
            });
        });
};

const getPost = (call, callback) => {
    console.log("getting")
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
        }).catch((err) => {
            console.log(err)
            callback({
                code: grpc.status.UNIMPLEMENTED,
                message: "unknown error",
            });
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
    knex('co_posts')
        .insert(response)
        .returning()
        .then((data) => {
            if (data.rowCount == 1) {
                callback(null, response);
            } else {
                callback({
                    code: grpc.status.UNKNOWN,
                    message: "post creation failed, check logs!",
                });
            }
        }).catch((err) => {
            console.log(err)
            callback({
                code: grpc.status.UNIMPLEMENTED,
                message: "unknown error",
            });
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
                callback({
                    code: grpc.status.INTERNAL,
                    message: "post update failed, check logs!",
                });
            }
        }).catch((err) => {
            console.log(err)
            callback({
                code: grpc.status.UNIMPLEMENTED,
                message: "unknown error",
            });
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
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: "Post Not Found",
                });
            }
        }).catch((err) => {
            console.log(err)
            callback({
                code: grpc.status.UNIMPLEMENTED,
                message: "unknown error",
            });
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