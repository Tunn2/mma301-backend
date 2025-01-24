const { default: mongoose } = require("mongoose");
const { getCourseByIdService } = require("./course.service");
const { getPromotionByIdService } = require("./promotion.service");
const Enrollment = require("../models/enrollment.model");

const createEnrollmentService = async ({ userId, courseId, promotionId }) => {
  if (!new mongoose.Types.ObjectId(courseId))
    throw new Error("Invalid course id");
  const foundCourse = await getCourseByIdService(courseId);
  if (!foundCourse) throw new Error("Course not found");

  let foundPromotion;
  let price = foundCourse.price;
  let totalPrice = price;
  if (promotionId) {
    if (!new mongoose.Types.ObjectId(promotionId))
      throw new Error("Invalid promotion id");
    foundPromotion = await getPromotionByIdService(promotionId);
    if (!foundPromotion) throw new Error("Promotion not found");
    totalPrice = totalPrice - (totalPrice * foundPromotion.rate) / 100;
  }

  return await Enrollment.create({
    user: new mongoose.Types.ObjectId(userId),
    course: new mongoose.Types.ObjectId(courseId),
    price,
    totalPrice,
    promotion: new mongoose.Types.ObjectId(promotionId),
  });
};

module.exports = { createEnrollmentService };
