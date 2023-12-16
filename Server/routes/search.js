// routes/user.js
const express = require('express');
const router = express.Router();
const { User } = require('../model/user');
const authenticateUser = require('../middleware/auth');


// Search users by name
router.get('/search/:userName', async (req, res) => {
    try {
        const searchTerm = req.params.userName;
        const users = await User.find({ userName: new RegExp(searchTerm, 'i') });
        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/profile/:userId', async (req, res) => {

    try {
        const userId = req.params.userId

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ error: 'user not found' })
        }

        res.json(user)
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



// Follow a user
router.post('/follow/:userId', authenticateUser, async (req, res) => {
    try {
        const loggedInUserId = req.user.userId; // Extracting userId from the token
        // Check if the logged-in user is trying to follow themselves
        if (loggedInUserId === req.params.userId) {
            return res.status(400).json({ error: "Cannot follow yourself" });
        }

        // Check if the logged-in user is already following the target user
        const loggedInUser = await User.findById(loggedInUserId);
        if (loggedInUser.following.includes(req.params.userId)) {
            return res.status(400).json({ error: "User is already being followed" });
        }

        // Update the following list of the logged-in user
        loggedInUser.following.push(req.params.userId);
        await loggedInUser.save();

        // Update the followers list of the target user
        const targetUser = await User.findById(req.params.userId);
        targetUser.followers.push(loggedInUserId);
        await targetUser.save();

        res.json({ message: 'Successfully followed user' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Unfollow a user
router.post('/unfollow/:userId', authenticateUser, async (req, res) => {
    try {
        const loggedInUserId = req.user.userId; // Extracting userId from the token

        // Update the following list of the logged-in user
        const loggedInUser = await User.findByIdAndUpdate(
            loggedInUserId,
            { $pull: { following: req.params.userId } },
            { new: true }
        );

        // Update the followers list of the target user
        const targetUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { followers: loggedInUserId } },
            { new: true }
        );

        res.json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.get('/isfollowing/:userId', authenticateUser, async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;
        console.log(loggedInUserId); // Assuming you have middleware to extract user info from the token
        const targetUserId = req.params.userId;

        const user = await User.findById(loggedInUserId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the logged-in user is following the target user
        const isFollowing = user.following.includes(targetUserId);

        res.json({ isFollowing });
    } catch (error) {
        console.error('Error checking if user is following:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/followers/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('followers', 'userName');
        res.json(user.followers);
    } catch (error) {
        console.error('Error fetching followers list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/following/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('following', 'userName');
        res.json(user.following);
    } catch (error) {
        console.error('Error fetching following list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
