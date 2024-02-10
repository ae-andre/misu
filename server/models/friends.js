const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const friendsSchema = new Schema(
  {
    requester: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    addressee: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "declined"],
      default: "requested",
    },
  },
  { timestamps: true }
);

const FriendModel = model("Friend", friendsSchema);

module.exports = FriendModel;
