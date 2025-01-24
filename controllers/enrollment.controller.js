require("dotenv").config();
const { createEnrollmentService } = require("../services/enrollment.service");
const {
  VNPay,
  ProductCode,
  dateFormat,
  VnpLocale,
  ignoreLogger,
} = require("vnpay");

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE,
  secureSecret: process.env.VNP_HASHSECRET,
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "sha512",
  enableLog: true,
  loggerFn: ignoreLogger,
});

const createEnrollmentController = async (req, res) => {
  try {
    const { courseId, promotionId } = req.body;
    const enrollment = await createEnrollmentService({
      courseId,
      promotionId,
      userId: req.userId,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const paymentUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: enrollment.totalPrice,
      vnp_IpAddr: "127.0.0.1",
      vnp_TxnRef: enrollment._id,
      vnp_OrderInfo: `Thanh toan don hang ${enrollment._id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: "http://localhost:3000/api/courses",
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    return res.json({ paymentUrl });
  } catch (error) {
    console.log(error);

    return res.send({ errorCode: 1, message: error.message });
  }
};

const verifyIPNCall = async (req, res) => {
  try {
    return res.send("kaka");
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = { createEnrollmentController, verifyIPNCall };
