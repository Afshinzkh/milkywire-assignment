const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const queries = require('./queries');

// grpc service definition
const postProtoPath = path.join(__dirname, '..', 'protos', 'post.proto');
const postProtoDefinition = protoLoader.loadSync(postProtoPath, { keepCase: true, json: true, arrays: true });
const postPackageDefinition = grpc.loadPackageDefinition(postProtoDefinition).post;

function main() {
    const server = new grpc.Server();
    // gRPC service
    server.addService(postPackageDefinition.PostService.service, {
        getAllPosts: queries.getAllPosts,
        getAllPostsByImpacterId: queries.getAllPostsByImpacterId,
        getPost: queries.getPost,
        createPost: queries.createPost,
        updatePost: queries.updatePost,
        deletePost: queries.deletePost
    });

    // gRPC server
    server.bindAsync(
        'localhost:50051',
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err != null) {
                return console.error(err);
            }
            server.start();
            console.log(`gRPC listening on ${port}`)
        }
    );
}

main();