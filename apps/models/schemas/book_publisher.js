const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Publisher alt şeması
const BookPublisherSchema = new Schema({
  publisher_name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "suspended"],
    default: "pending",
    required: true,
  },
});
module.exports = BookPublisherSchema;
