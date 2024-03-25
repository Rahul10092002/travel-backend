const { default: mongoose, model } = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, min: 2, max: 50, required: true },
  email: { type: String, min: 2, max: 50, required: true, unique: true },
  password: { type: String, required: true },
  photoURL: { type: String, default: "" },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
