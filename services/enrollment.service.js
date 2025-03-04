const { default: mongoose } = require("mongoose");
const { getCourseByIdService } = require("./course.service");
const { getPromotionByIdService } = require("./promotion.service");
const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");

const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  console.log("🔍 Đang kiểm tra đơn hàng chưa thanh toán...");

  const now = new Date();
  const expirationTime = new Date(now.getTime() - 1 * 60 * 1000); // Đơn hàng quá 15 phút

  try {
    // Tìm các đơn hàng ở trạng thái "Chờ thanh toán" và đã quá 15 phút
    const expiredEnrollments = await Enrollment.find({
      status: "PENDING",
      createdAt: { $lt: expirationTime },
    });

    if (expiredEnrollments.length > 0) {
      // Cập nhật trạng thái đơn hàng thành "Đã hủy"
      await Enrollment.updateMany(
        {
          _id: { $in: expiredEnrollments.map((enrollment) => enrollment._id) },
        },
        { status: "CANCELLED" }
      );
      console.log(
        `✅ Đã hủy ${expiredEnrollments.length} đơn hàng chưa thanh toán.`
      );
    } else {
      console.log("✅ Không có đơn hàng nào cần hủy.");
    }
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật đơn hàng:", error);
  }
});

const createEnrollmentService = async ({ userId, courseId, promotionId }) => {
  if (!new mongoose.Types.ObjectId(courseId))
    throw new Error("Invalid course id");
  const foundCourse = await Course.findOne({
    _id: new mongoose.Types.ObjectId(courseId),
    isActive: true,
  }).lean();
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

  const foundEnrollment = await Enrollment.findOne({
    user: new mongoose.Types.ObjectId(userId),
    course: new mongoose.Types.ObjectId(courseId),
    status: "COMPLETED",
  }).lean();

  if (foundEnrollment) {
    throw new Error("You have already purchased this course");
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
