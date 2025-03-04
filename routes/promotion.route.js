const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createPromotionController,
  getPromotionsController,
  getPromotionByIdController,
  getAvailablePromotionController,
} = require("../controllers/promotion.controller");
const promotionRoute = express.Router();

promotionRoute.use(authenticate);
promotionRoute.get("/available", getAvailablePromotionController);
promotionRoute.get("/", getPromotionsController);
promotionRoute.get("/:id", getPromotionByIdController);

promotionRoute.use(checkAdminRole);
promotionRoute.post("/", createPromotionController);

module.exports = promotionRoute;
