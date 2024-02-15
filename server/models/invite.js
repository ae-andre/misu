const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const InviteSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  inviterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  used: { // should I do this?
    type: Boolean,
    default: false 
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '48h' // Optional: Token expires after 48 hours ??
  }
});

const InviteModel = model("Invite", InviteSchema);

module.exports = InviteModel;