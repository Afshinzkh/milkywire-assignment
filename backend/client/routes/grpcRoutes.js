// requirements
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');


// grpc client definition
const postProtoPath = path.join(__dirname, '..', '..', 'protos', 'post.proto');
const postProtoDefinition = protoLoader.loadSync(postProtoPath, { keepCase: true });
const postPackageDefinition = grpc.loadPackageDefinition(postProtoDefinition).post;

const client = new postPackageDefinition.PostService(
    'localhost:50051', grpc.credentials.createInsecure());

// handlers
const getAllPosts = (req, res) => {
    client.getAllPosts({}, (err, result) => {
        console.log(result)
        res.json(result);
    });
};
const getAllPostsByImpacterId = (req, res) => {
    const payload = { impacter_id: parseInt(req.params.impacter_id) };
    client.getAllPostsByImpacterId(payload, (err, result) => {
        if (err) {
            res.json('That Post does not exist for impacter Id.');
        } else {
            res.json(result);
        }
    });
};
const getPost = (req, res) => {
    const payload = { post_id: parseInt(req.params.post_id) };
    client.getPost(payload, (err, result) => {
        if (err) {
            const status = err.code === grpc.status.NOT_FOUND ? 404 : 500;
            return res.status(status).send({
                message: err.details
            });
        } else {
            res.json(result);
        }
    });
};

const createPost = (req, res) => {
    const payload = {
        type: req.body.type,
        description: req.body.description,
        status: req.body.status,
        impacter_id: parseInt(req.body.impacter_id),
        reaction_count: parseInt(req.body.reaction_count),
        data: req.body.data,
    };
    client.createPost(payload, (err, result) => {
        if (err) {
            return res.status(result.code).send({
                message: result.message
            });
        } else {
            res.json(result);
        }
    });
};

const updatePost = (req, res) => {
    const payload = {
        post_id: parseInt(req.params.post_id),
        type: req.body.type,
        description: req.body.description,
        status: req.body.status,
        impacter_id: parseInt(req.body.impacter_id),
        reaction_count: parseInt(req.body.reaction_count),
        data: req.body.data,
    };
    client.updatePost(payload, (err, result) => {
        if (err) {
            res.json('That Post does not exist.');
        } else {
            res.json(result);
        }
    });
};

const deletePost = (req, res) => {
    const payload = { post_id: parseInt(req.params.post_id) };

    client.deletePost(payload, (err, result) => {
        if (err) {
            res.json('That Post does not exist.');
        } else {
            res.json(result);
        }
    });
};

module.exports = {
    getAllPosts,
    getAllPostsByImpacterId,
    getPost,
    createPost,
    updatePost,
    deletePost
};