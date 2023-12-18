const express = require('express');
const router = express.Router();
const { User } = require('../model/user');
const Post = require('../model/post');

router.get('/following/content/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).populate('following', 'userName');

        const followingUserIds = user.following.map(followingUser => followingUser._id);

        const posts = await Post.find({ userId: { $in: followingUserIds } }).populate('userId', 'userName')

        res.json({ posts, user });
    } catch (error) {
        console.error('Error fetching following users\' posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
