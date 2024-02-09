const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const verifyToken = require('../middleware/verifyToken');


// Environment variables for JWT
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// User registration endpoint
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).send('User already exists');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// User login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const payload = {
            id: user._id,
            email: user.email // Add any other user info you need
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ token, user: payload }); // Send both token and user data
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/validateToken', verifyToken, (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      res.json({ 
        success: true,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        }
    });
    } catch (error) {
      res.status(401).json({ success: false, message: "Token is not valid" });
    }
  });

module.exports = router;
