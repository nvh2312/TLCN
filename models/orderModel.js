const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },
    address: {
      type: String,
      required: [true, "Order must have address to delivery"],
    },
    receiver: {
      type: String,
      required: [true, "Order must have receiver to contact"],
    },
    phone: {
      type: String,
      required: [true, "Order must have phone to contact"],
    },
    cart: [
      {
        product: Object,
        quantity: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    totalPrice: Number,
    payments: {
      type: String,
      required: [true, "An order must have a payment"],
      enum: {
        values: ["tiền mặt", "ngân hàng"],
        message: "Phương thức thanh toán là tiền mặt hoặc ngân hàng",
      },
    },
    status: {
      type: String,
      enum: {
        values: [
          "Cancelled",
          "Processed",
          "Waiting Goods",
          "Delivery",
          "Success",
        ],
      },
      default: "Processed",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
orderSchema.index({'$**': 'text'});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
