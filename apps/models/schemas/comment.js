const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Comment alt şeması - kitap yorumları için
const CommentSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = CommentSchema;
