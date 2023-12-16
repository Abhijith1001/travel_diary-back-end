// routes/signup.js
const express = require('express');
const router = express.Router();
const { User } = require('../model/user');

router.post("/newuser", async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const newUser = new User({ userName, email, password });
        await newUser.save();
        res.status(201).json({ user_id: newUser._id, message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
