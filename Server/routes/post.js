const express = require('express');
const router = express.Router();
const Post = require('../model/post');
const authenticateUser = require('../middleware/auth');

router.post('/addpost', authenticateUser, async (req, res) => {
    const { content } = req.body;

    try {
        const newPost = new Post({ userId: req.user.userId, content }); // Use req.user.userId
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getposts', authenticateUser, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.userId }); // Use req.user.userId
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
