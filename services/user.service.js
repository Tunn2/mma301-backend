const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const Child = require("../models/child.model");

const findUserByIdService = async (id) => {
  if (id && new mongoose.Types.ObjectId(id))
    return await User.findOne({ _id: id })
      .select("-password -createdAt -updatedAt")
      .lean();
  return null;
};

const createChildService = async ({ userId, username, age }) => {
  return await Child.create({
    parents: new mongoose.Types.ObjectId(userId),
    username,
    age,
  });
};

const getChildrenService = async (userId) => {
  return await Child.find({ parents: new mongoose.Types.ObjectId(userId) })
    .select("_id username age")
    .lean();
};

module.exports = {
  findUserByIdService,
  createChildService,
  getChildrenService,
};
