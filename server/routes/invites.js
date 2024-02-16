const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Invite = require('../models/invite');
const verifyToken = require('../middleware/verifyToken');
const crypto = require('crypto'); // Node.js built-in module

// Middleware to protect the route
router.use('/generate', verifyToken);

router.get('/validate/:token', verifyToken, async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token });

    if (!invite || invite.used) {
      return res.status(404).json({ message: "Invite not found or already used" });
    }

    const inviter = await User.findById(invite.inviterId);
    if (!inviter) {
      return res.status(404).json({ message: "Inviter not found" });
    }

    // Correctly format the inviter's information to include their name and photo URL
    res.json({
      inviter: {
        id: inviter.id,
        name: inviter.firstName + " " + inviter.lastName, // Assuming you have firstName and lastName fields
        photoUrl: inviter.photoUrl
      }
    });
  } catch (error) {
    console.error('Error validating invite token:', error);
    res.status(500).send('Server error');
  }
});

router.post('/accept', verifyToken, async (req, res) => {
  try {
    const { token } = req.body;
    const invite = await Invite.findOne({ token });

    if (!invite || invite.used) {
      return res.status(404).json({ message: "Invite not found or already used" });
    }

    // Adding each other as friends
    const inviter = await User.findById(invite.inviterId);
    const invitedUser = await User.findById(req.user.id);

    if (!inviter || !invitedUser) {
      return res.status(404).json({ message: "Inviter or invited user not found" });
    }

    // Prevent adding duplicate friend entries
    if (!inviter.friends.includes(invitedUser._id)) {
      inviter.friends.push(invitedUser._id);
    }
    if (!invitedUser.friends.includes(inviter._id)) {
      invitedUser.friends.push(inviter._id);
    }

    await inviter.save();
    await invitedUser.save();

    // Marking the invite as used
    invite.used = true;
    await invite.save();

    console.log(`Invite accepted: ${inviter.email} and ${invitedUser.email} are now friends.`);
    res.json({ message: "Friend added successfully" });
  } catch (error) {
    console.error('Error accepting invite:', error);
    res.status(500).send('Server error');
  }
});


router.post('/generate', async (req, res) => {
  try {
    const inviterId = req.user.id;
    const token = crypto.randomBytes(20).toString('hex'); // Generates a random token

    const newInvite = new Invite({
      inviterId,
      token,
    });

    await newInvite.save();

    res.json({ token }); // Sends the generated token back to the client
  } catch (error) {
    console.error('Error generating invite token:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;