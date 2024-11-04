// schemas/Publisher.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublisherSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    _id: true, // Publisher'ın kendi ID'si olsun
  }
);

module.exports = PublisherSchema;
