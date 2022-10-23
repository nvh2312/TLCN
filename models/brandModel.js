const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A brand must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        20,
        "A brand name must have less or equal then 40 characters",
      ],
      minlength: [2, "A brand name must have more or equal then 3 characters"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const brand = mongoose.model("Brand", brandSchema);

module.exports = brand;
