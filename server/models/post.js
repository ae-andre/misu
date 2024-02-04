const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  imagePath: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
