const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address format",
    },
  },
  password: { type: String, required: true, maxLength: 100 },
  createdAt: { type: Date, imumutable: true },
  updatedAt: { type: Date, default: () => Date.now() },
});

userSchema.virtual("url").get(function () {
  return `/rooms/${this._id}`;
});

userSchema.virtual("fullName").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("User", userSchema);
