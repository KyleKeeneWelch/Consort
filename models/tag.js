const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxLength: 100 },
  createdAt: { type: Date, imumutable: true },
});

module.exports = mongoose.model("Tag", tagSchema);
