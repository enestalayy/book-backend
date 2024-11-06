const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book_id: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Comment", CommentSchema);
