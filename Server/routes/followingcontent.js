const express = require('express');
const router = express.Router();
const { User } = require('../model/user');
const Post = require('../model/post');

router.get('/following/content/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Retrieve the user with the specified userId and populate the 'following' field
        const user = await User.findById(userId).populate('following');

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract following IDs
        const followingIds = user.following.map(following => following._id);

        // Log the followingIds for debugging
        console.log('Following IDs:', followingIds);

        // Retrieve posts from users who are being followed
        const feeds = await Post.find({ userId: { $in: followingIds } }).populate('userId', 'userName');

        // Log the retrieved feeds for debugging
        console.log('Feeds:', feeds);

        res.json(feeds);
    } catch (error) {
        console.error('Error fetching feeds:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/like/:userId', async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.params.userId;

        const post = await Post.findOne({ _id: postId, userId: userId });

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


module.exports = router;
