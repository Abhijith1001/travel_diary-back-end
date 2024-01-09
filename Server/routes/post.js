const express = require('express');
const router = express.Router();
const { User } = require('../model/user')
const Post = require('../model/post');
const authenticateUser = require('../middleware/auth');

router.post('/addpost', authenticateUser, async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.userId; // Assuming you have a middleware to extract user info from the token

        const post = await Post.create({ userId, content, followers: [], likes: [] });

        // Update the feeds of followers
        const user = await User.findById(userId).populate('followers');
        const followerIds = user.followers.map(follower => follower._id);

        // Update the post's followers field
        post.followers = followerIds;
        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





router.get('/getposts', authenticateUser, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.userId }).populate('userId', 'userName');; // Use req.user.userId
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get/searchuser/post/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const searchuserpost = await Post.find({ userId: userId })
        res.json(searchuserpost)
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.post('/like', authenticateUser, async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({ error: 'postId is required' });
        }

        const userId = req.user.userId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already liked the post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ error: 'User already liked this post' });
        }

        post.likes.push(userId);
        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  router.get('/shareposts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Retrieve the post by ID
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const sanitizedPost = {
            _id: post._id,
            content: post.content,
            // Add other necessary fields here
        };


        // Include post details in the response
        res.json({ success: true, post: sanitizedPost });
    } catch (error) {
        console.error('Error retrieving shared post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
