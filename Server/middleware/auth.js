const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error();
        }

        // Store only the userId in req.user
        req.user = { userId: user._id };
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = authenticateUser;
