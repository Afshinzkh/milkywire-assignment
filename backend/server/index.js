const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

const config = require('./knexfile.js');
const knex = require('knex')(config);

const { uuid } = require('uuidv4');

// grpc service definition
const postProtoPath = path.join(__dirname, '..', 'protos', 'post.proto');
const postProtoDefinition = protoLoader.loadSync(postProtoPath);
const postPackageDefinition = grpc.loadPackageDefinition(postProtoDefinition).post;

// knex queries
function getAllPosts(call, callback) {
    knex('co_posts')
        .then((data) => { callback(null, { posts: data }); });
}
function getAllPostsByImpacterId(call, callback) {
    knex('co_posts')
        .where({ impacter_id: parseInt(call.request.impacter_id) })
        .then((data) => {
            if (data.length) {
                callback(null, { posts: data });
            } else {
                callback('no post for the given impacter id found.');
            }
        });
}
function getPost(call, callback) {
    knex('co_posts')
        .where({ id: parseInt(call.request.id) })
        .then((data) => {
            if (data.length) {
                callback(null, data[0]);
            } else {
                callback('no post for the given post id found.');
            }
        });
}

function createPost(call, callback) {
    knex('co_posts')
        // test for null values
        .insert({
            id: uuid(),
            ...call.request.description ? { description: call.request.description } : {},
            ...call.request.type ? { type: call.request.type } : {},
            ...call.request.status ? { status: call.request.status } : {},
            ...call.request.impacter_id ? { impacter_id: call.request.impacter_id } : {},
            ...call.request.reaction_count ? { reaction_count: call.request.reaction_count } : {},
            ...call.request.data ? { data: call.request.data } : {},
            created_at: Date.now(),
            updated_at: Date.now()
        })
        .returning()
        .then((data) => {
            if (data) {
                callback(null, { status: 'success' });
            } else {
                callback('failed to create new post.');
            }
        });
}

function updatePost(call, callback) {
    knex('co_posts')
        .where({ id: parseInt(call.request.id) })
        .update({
            ...call.request.description ? { description: call.request.description } : {},
            ...call.request.type ? { type: call.request.type } : {},
            ...call.request.status ? { status: call.request.status } : {},
            ...call.request.impacter_id ? { impacter_id: call.request.impacter_id } : {},
            ...call.request.reaction_count ? { reaction_count: call.request.reaction_count } : {},
            ...call.request.data ? { data: call.request.data } : {},
            updated_at: Date.now()
        })
        .returning()
        .then((data) => {
            if (data) {
                callback(null, { status: 'success' });
            } else {
                callback('no post for the given post id found.');
            }
        });
}
function deletePost(call, callback) {
    knex('co_posts')
        .where({ id: parseInt(call.request.id) })
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

function main() {
    const server = new grpc.Server();
    // gRPC service
    server.addService(postPackageDefinition.PostService.service, {
        getAllPosts: getAllPosts,
        getAllPostsByImpacterId: getAllPostsByImpacterId,
        getPost: getPost,
        createPost: createPost,
        updatePost: updatePost,
        deletePost, deletePost
    });

    // gRPC server
    server.bind('localhost:50051', grpc.ServerCredentials.createInsecure()); // add authentication
    server.start();
    console.log('gRPC server running at http://127.0.0.1:50051');
}

main();