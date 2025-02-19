const express = require("express");
const {
  registerController,
  loginController,
  refreshTokenController,
} = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const authRoute = express.Router();

authRoute.post("/register", registerController);
authRoute.post("/login", loginController);

authRoute.post("/refresh-token", refreshTokenController);

module.exports = authRoute;
