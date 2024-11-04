const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = require("./schemas/comment");
const BookPublisherSchema = require("./schemas/book_publisher");

// Book ana şeması
const BookSchema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    types: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    publish: BookPublisherSchema,
    publish_no: {
      type: Number,
      default: 0,
      required: true,
    },
    total_page: {
      type: String,
      required: true,
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);
BookSchema.index({ publish: 1 });

module.exports = mongoose.model("Book", BookSchema);
