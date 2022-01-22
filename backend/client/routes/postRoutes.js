// requirements
const express = require('express');
const grpcRoutes = require('./grpcRoutes');

// new router
const router = express.Router();

// routes
router.get('/posts', grpcRoutes.getAllPosts);
router.get('/posts/impacter/:impacter_id', grpcRoutes.getAllPostsByImpacterId);
router.get('/posts/:post_id', grpcRoutes.getPost);
router.post('/posts', grpcRoutes.createPost);
router.put('/posts/:post_id', grpcRoutes.updatePost);
router.delete('/posts/:post_id', grpcRoutes.deletePost);

module.exports = router;