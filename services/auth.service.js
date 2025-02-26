require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email })
    .select("_id username email password phone role")
    .lean();
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      delete user["password"];

      // await User.updateOne(
      //   { _id: user._id },
      //   {
      //     $addToSet: {
      //       refreshTokenUsed: user.refreshToken,
      //     },
      //     $set: { refreshToken: refreshToken },
      //   }
      // );
      // delete user["refreshToken"];
      // console.log(user);
      const { _id } = user;
      const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
      });
      return {
        ...user,
        access_token: token,
        refresh_token: refreshToken,
      };
    } else {
      throw new Error("Invalid email or password");
    }
  } else {
    throw new Error("Invalid email or password");
  }
};

const registerService = async ({ username, password, email, phone }) => {
  try {
    const isExistedEmail = await checkEmailExist(email);
    if (isExistedEmail) throw new Error("This email already existed");
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
      email,
      phone,
    });

    const user = await User.findOne({ email })
      .select("-password -updatedAt -createdAt -isActive")
      .lean();
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const refreshTokenService = async (refreshToken) => {
  const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const { _id } = decodedToken;
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
    .select("_id username email password phone role refreshToken")
    .lean();
  if (!user) throw new Error("There's something wrong");
  if (user.refreshToken != refreshToken)
    throw new Error("There's something wrong");

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return {
    access_token: token,
  };
};

const checkEmailExist = async (email) => {
  const foundUser = await User.findOne({ email });
  if (foundUser) return true;
  return false;
};

module.exports = {
  loginService,
  registerService,
  refreshTokenService,
};
