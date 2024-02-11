const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, maxLength: 2000 },
  createdAt: { type: Date, imumutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

module.exports = mongoose.model("Comment", userSchema);
