const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
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

const Child = mongoose.model("Child", childSchema);
module.exports = Child;
