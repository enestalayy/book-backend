const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReadingSchema = new Schema(
  {
    book_id: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    current_page: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);
module.exports = ReadingSchema;
