const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ 
  },
  password: { 
    type: String, 
    required: true 
  },
  photoUrl: {
    type: String,
    default: '',
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }]
}, {
  toJSON: {
      virtuals: true
  }
});

UserSchema.virtual("friendCount").get(function() {
  // Ensure this.friends exists and is an array before accessing its length
  return Array.isArray(this.friends) ? this.friends.length : 0;
});

const UserModel = model("User", UserSchema)

module.exports = UserModel