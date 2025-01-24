require("dotenv").config();
const {
  createEnrollmentService,
  getEnrollmentByIdService,
  updateEnrollmentByIdService,
} = require("../services/enrollment.service");
const {
  VNPay,
  ProductCode,
  dateFormat,
  VnpLocale,
  ignoreLogger,
  IpnFailChecksum,
  IpnOrderNotFound,
  IpnInvalidAmount,
  InpOrderAlreadyConfirmed,
  IpnSuccess,
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
    const verify = vnpay.verifyIpnCall(req.query);
    console.log("1");
    if (!verify.isSuccess) {
      return res.json(IpnFailChecksum);
    }

    const foundEnrollment = await getEnrollmentByIdService(verify.vnp_TxnRef);

    console.log("2");
    console.log(foundEnrollment);
    console.log(verify.vnp_TxnRef);
    if (
      !foundEnrollment ||
      verify.vnp_TxnRef !== foundEnrollment._id.toString()
    )
      return res.json(IpnOrderNotFound);

    console.log("3");
    if (verify.vnp_Amount !== foundEnrollment.totalPrice) {
      return res.json(IpnInvalidAmount);
    }

    // Nếu đơn hàng đã được xác nhận trước đó
    console.log("4");
    if (foundEnrollment.status === "COMPLETED") {
      return res.json(InpOrderAlreadyConfirmed);
    }

    await updateEnrollmentByIdService({ id: foundEnrollment._id });

    return res.json(IpnSuccess);
  } catch (error) {
    console.log("verify error", error);
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = { createEnrollmentController, verifyIPNCall };
