const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    parents: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
