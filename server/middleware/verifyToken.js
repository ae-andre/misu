const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    // Get token from the header
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer TOKEN

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtSecret);
        // Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

module.exports = verifyToken;
