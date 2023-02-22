const mongoose = require("mongoose");

/* Destructuring the Schema from mongoose. */
const { Schema } = mongoose;

/* Creating a new schema called UserSchema. */
const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

/* Creating a model called User and it is using the UserSchema to create the model. */
const User = mongoose.model("user", UserSchema);
module.exports = User;
