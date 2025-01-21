const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  createChildController,
  getChildrenController,
} = require("../controllers/user.controller");
const userRoute = express.Router();

userRoute.use(authenticate);
userRoute.post("/children", createChildController);
userRoute.get("/children", getChildrenController);

module.exports = userRoute;
