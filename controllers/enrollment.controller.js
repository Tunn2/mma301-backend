require("dotenv").config();
const { createEnrollmentService } = require("../services/enrollment.service");
const vnpay = require("vnpay");
const dayjs = require("dayjs");
const crypto = require("crypto");

const createEnrollmentController = async (req, res) => {
  try {
    const { courseId, promotionId, price, totalPrice } = req.body;
    const enrollment = await createEnrollmentService({
      courseId,
      promotionId,
      price,
      totalPrice,
      userId: req.userId,
    });

    // const returnUrl = "http://localhost:3000/";

    // req.connection.socket.remoteAddress;
    var ipAddr = "127.0.0.1";

    // var config = require('config');
    // var dateFormat = require("dateformat");

    var tmnCode = process.env.VNP_TNMCODE;
    var secretKey = process.env.VNP_HASHSECRET;
    var vnpUrl = process.env.VNP_URL;
    var returnUrl = process.env.VNP_RETURN_URL;
    const date = new Date();
    var createDate = dayjs(date).format("YYYYMMDDHHmmss");
    var orderId = enrollment._id.toString();
    var amount = enrollment.totalPrice;
    var bankCode = req.body.bankCode;

    var orderInfo = "xinchao";
    var orderType = "other";
    var locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = 123222 * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    // vnp_Params = sortObject(vnp_Params);

    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    // res.redirect(vnpUrl)
    return res.json({ vnpUrl, enrollment });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = { createEnrollmentController };
