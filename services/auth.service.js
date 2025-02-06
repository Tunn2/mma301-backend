require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email })
    .select("_id username email password phone role")
    .lean();
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      delete user["password"];
      return {
        ...user,
        access_token: token,
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

const checkEmailExist = async (email) => {
  const foundUser = await User.findOne({ email });
  if (foundUser) return true;
  return false;
};

module.exports = {
  loginService,
  registerService,
};
