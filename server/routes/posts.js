const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Post = require('../models/post');

// Example: Fetch all posts from friends
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: req.user.friends } }).populate('author', 'name');
        res.json(posts);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Example: Create a new post
router.post('/addpost', verifyToken, async (req, res) => {
    const post = new Post({
        content: req.body.content,
        author: req.body.author, // This should come from authenticated user session
      });
      
    try {
        const newPost = new Post({
            ...req.body,
            author: req.user.id,
        });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
