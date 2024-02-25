const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 500 },
  tags: [{ type: Schema.Types.Mixed, ref: "Tag", required: true }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, imumutable: true },
  updatedAt: { type: Date, default: () => Date.now() },
});

roomSchema.virtual("url").get(function () {
  return `/rooms/${this._id}`;
});

roomSchema.virtual("createdAtFormatted").get(function () {
  return this.createdAt
    ? DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED)
    : "";
});

roomSchema.virtual("updatedAtFormatted").get(function () {
  return this.updatedAt
    ? DateTime.fromJSDate(this.updatedAt).toLocaleString(DateTime.DATETIME_MED)
    : "";
});

module.exports = mongoose.model("Room", roomSchema);
