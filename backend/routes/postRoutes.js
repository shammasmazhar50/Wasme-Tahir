const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Public routes (cached for 5 minutes)
router.get('/', cacheMiddleware(300), postController.getPosts);
router.get('/:slug', cacheMiddleware(300), postController.getPostBySlug);

// Protected routes
router.post('/', auth, postController.createPost);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
