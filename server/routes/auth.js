const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Invite = require('../models/invite');
const verifyToken = require('../middleware/verifyToken');


// Environment variables for JWT
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// User registration endpoint
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, inviteToken } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).send('User already exists');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Handle invite token logic
        if (inviteToken) {
            const invite = await Invite.findOne({ token: inviteToken });
            if (invite && !invite.used) {
                const inviter = await User.findById(invite.inviterId);
                if (inviter) {
                    // Establish a connection between the new user and the inviter

                    inviter.friends.push(newUser.id);
                    newUser.friends.push(inviter.id);

                    await inviter.save();
                    await newUser.save();

                    // Mark the invite as used
                    invite.used = true;
                    await invite.save();
                }
            }
        }

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
            firstName: user.firstName, // Include first name in the payload
            lastName: user.lastName,   // Include last name in the payload
            email: user.email
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
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email
        }
    });
    } catch (error) {
      res.status(401).json({ success: false, message: "Token is not valid" });
    }
  });

module.exports = router;
