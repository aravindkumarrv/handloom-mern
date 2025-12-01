// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // category is now any required string (no enum restriction)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },

    // visible to customers or not
    available: {
      type: Boolean,
      default: true,
    },

    // how many pieces are in stock
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
