const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

const findUserByIdService = async (id) => {
  try {
    if (id && new mongoose.Types.ObjectId(id))
      return await User.findOne({ _id: id })
        .select("-password -createdAt -updatedAt")
        .lean();
    return null;
  } catch (error) {
    console.log(error);
  }
};

const createKidService = ({ id }) => {};

module.exports = {
  findUserByIdService,
};
