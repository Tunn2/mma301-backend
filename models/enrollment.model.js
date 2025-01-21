const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    promotion: {
      type: mongoose.Types.ObjectId,
      ref: "Promotion",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "DONE"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
