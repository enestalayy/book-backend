const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PublisherSchema = require("./schemas/publisher");
const ReadingSchema = require("./schemas/reading");

// Reading alt şeması - kullanıcının okuduğu kitaplar için
// const ReadingSchema = new Schema(
//   {
//     book_id: {
//       type: Schema.Types.ObjectId,
//       ref: "Book",
//       required: true,
//     },
//     current_page: {
//       type: Number,
//       required: true,
//     },
//   },
//   { _id: false }
// );

// Publisher alt şeması - yayıncı bilgileri için
// const PublisherSchema = new Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "suspended"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// User ana şeması
const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    publisher: PublisherSchema, // Publisher bilgileri artık bir obje olarak tutulacak

    writings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    readings: [ReadingSchema],
  },
  { timestamps: true }
);

UserSchema.index({ publisher: 1, "readings.book_id": 1 });

module.exports = mongoose.model("User", UserSchema);
