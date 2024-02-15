const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../uploadConfig');



// Get current user's profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
});


// SHOW ALL USER OBJECTS
// JUST FOR DEVELOPMENT
// REMOVE BEFORE PRODUCTION
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error while fetching photo URLs');
    }
  });

router.get('/friends', async (req, res) => {
    try {
      const users = await User.findById();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error while fetching photo URLs');
    }
  });

const multerUpload = upload.single('photo');

router.post('/photo', verifyToken, upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: "No file selected." });
    }

    try {
        const userId = req.user.id; 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        console.log("Updating photoUrl for user", userId);
        user.photoUrl = `/uploads/${req.file.filename}`; // Adjust according to your file path logic
        await user.save();
        console.log("photoUrl updated to", user.photoUrl);
        return res.status(200).send({ message: "Photo uploaded successfully.", filePath: user.photoUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error" });
    }
});

module.exports = router;
