const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  table_number: {
    type: Number,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  notes: {
    type: String,
  },
  total_price: {
    type: Number,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
});

module.exports = mongoose.model("Order", orderSchema);
