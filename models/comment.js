const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, maxLength: 2000 },
  createdAt: { type: Date, imumutable: true },
  updatedAt: { type: Date, default: () => Date.now() },
});

commentSchema.virtual("createdAtFormatted").get(function () {
  return this.createdAt
    ? DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED)
    : "";
});

commentSchema.virtual("updatedAtFormatted").get(function () {
  return this.updatedAt
    ? DateTime.fromJSDate(this.updatedAt).toLocaleString(DateTime.DATETIME_MED)
    : "";
});

module.exports = mongoose.model("Comment", commentSchema);
