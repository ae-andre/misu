const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Comment = require('../models/comment');

// Example: Add a comment to a post
router.post('/:postId', verifyToken, async (req, res) => {
    try {
        const newComment = new Comment({
            content: req.body.content,
            post: req.params.postId,
            author: req.user.id,
        });
        const comment = await newComment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
