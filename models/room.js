const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 500 },
  tags: [{ type: Schema.Types.Mixed, ref: "Tag", required: true }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, imumutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

roomSchema.virtual("url").get(function () {
  return `/rooms/${this._id}`;
});

module.exports = mongoose.model("Room", roomSchema);
