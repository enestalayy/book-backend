const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
    publisher: BookPublisherSchema,
    publish_no: {
      type: Number,
      default: 1,
      required: true,
    },
    total_page: {
      type: String,
      required: true,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    readers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
BookSchema.index({ "publisher.status": 1 });

module.exports = mongoose.model("Book", BookSchema);
