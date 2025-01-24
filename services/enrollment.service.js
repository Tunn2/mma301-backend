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

const getEnrollmentByIdService = async (id) => {
  if (!new mongoose.Types.ObjectId(id))
    throw new Error("Invalid enrollment id");
  const foundEnrollment = await Enrollment.findOne({
    _id: new mongoose.Types.ObjectId(id),
  })
    .select("-__v -updatedAt")
    .lean();
  if (!foundEnrollment) throw new Error("Enrollment not found");
  return foundEnrollment;
};

const updateEnrollmentByIdService = async ({ id, status = "COMPLETED" }) => {
  if (!new mongoose.Types.ObjectId(id))
    throw new Error("Invalid enrollment id");
  return await Enrollment.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    { status }
  );
};

module.exports = {
  createEnrollmentService,
  getEnrollmentByIdService,
  updateEnrollmentByIdService,
};
