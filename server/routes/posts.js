const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Post = require('../models/post');
const User = require('../models/user');

// Example: Fetch all posts from friends
router.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Fetch posts from the user and their friends
      const posts = await Post.find({
        user: { $in: [userId, ...user.friends] }
      }).populate('user', 'username');
  
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

// Create a new post
router.post('/', verifyToken, async (req, res) => {
    const post = new Post({
        content: req.body.content,
        user: req.body.user,
      });
      
    try {
        const newPost = new Post({
            ...req.body,
            user: req.user.id,
        });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
