const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendshipSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  addressee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['requested', 'accepted', 'declined'], default: 'requested' }
}, { timestamps: true });

module.exports = mongoose.model('Friendship', friendshipSchema);
