const express = require('express');
const router = express.Router();
const {User} = require('../model/user');
const jwt = require('jsonwebtoken');

router.post('/olduser', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email, password });

        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, 'your_secret_key', {
                expiresIn: '1h',
            });

            res.status(200).json({ token, userId: existingUser._id });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
