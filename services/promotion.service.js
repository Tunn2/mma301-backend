const Promotion = require("../models/promotion.model");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const getPromotionByIdService = async (id) => {
  const promotion = await Promotion.findOne({ _id: id, isActive: true })
    .select("_id code rate startDate endDate")
    .lean();

  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

const getAvailablePromotionService = async () => {
  const now = new Date();

  // Chuyển đổi ngày string "dd-MM-yyyy" từ MongoDB thành Date để so sánh
  const promotions = await Promotion.find()
    .select("_id code rate startDate endDate")
    .lean();

  // Lọc dữ liệu trong JavaScript vì MongoDB không thể so sánh string dạng ngày đúng
  const validPromotions = promotions.filter((promo) => {
    const startDate = convertStringToDate(promo.startDate);
    const endDate = convertStringToDate(promo.endDate);

    return startDate <= now && endDate >= now;
  });

  return validPromotions;
};

// Hàm chuyển đổi "dd-MM-yyyy" thành Date object
const convertStringToDate = (dateStr) => {
  const [dd, mm, yyyy] = dateStr.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`); // Chuyển đổi thành "yyyy-MM-dd" để Date hiểu đúng
};

const getPromotionsService = async ({ search = "", limit = 10, page = 1 }) => {
  const query = search
    ? { code: { $regex: search, $options: "i", isActive: true } }
    : { isActive: true };
  const skip = (page - 1) * limit;
  const promotions = await Promotion.find(query)
    .skip(skip)
    .limit(+limit)
    .select("_id code rate startDate endDate")
    .lean();

  return {
    data: promotions,
    totalPage: Math.ceil(promotions.length / limit),
    currentPage: +page,
  };
};

const createPromotionService = async ({ code, rate, startDate, endDate }) => {
  const format = "DD-MM-YYYY";
  if (
    dayjs(startDate, format).isBefore(dayjs(), "day") ||
    dayjs(endDate, format).isBefore(dayjs(startDate, format), "day")
  ) {
    throw new Error(
      "The start date cannot be before today, and the end date must be after the start date"
    );
  }

  const promotion = await Promotion.findOne({ code });
  if (promotion) throw new Error("This code existed");

  const promotions = await Promotion.find({ rate }).lean();

  if (promotions) {
    promotions.forEach((promotion) => {
      if (
        checkOverlap(
          startDate,
          endDate,
          promotion.startDate,
          promotion.endDate,
          format
        )
      )
        throw new Error("This promotion is overlapped");
    });
  }

  return await Promotion.create({
    code,
    rate,
    startDate: startDate,
    endDate: endDate,
  });
};

const updatePromotionById = async (id, { code, rate, startDate, endDate }) => {
  const format = "DD-MM-YYYY";
  if (
    dayjs(startDate, format).isBefore(dayjs(), "day") ||
    dayjs(endDate, format).isBefore(dayjs(startDate, format), "day")
  ) {
    throw new Error(
      "The start date cannot be before today, and the end date must be after the start date"
    );
  }

  const promotions = await Promotion.find({ rate }).lean();
};

const checkOverlap = (startDate1, endDate1, startDate2, endDate2, format) => {
  const start1 = dayjs(startDate1, format);
  const end1 = dayjs(endDate1, format);
  const start2 = dayjs(startDate2, format);
  const end2 = dayjs(endDate2, format);
  return start1.isBefore(end2, "day") && end1.isAfter(start2, "day");
};

module.exports = {
  createPromotionService,
  getPromotionsService,
  getPromotionByIdService,
  getAvailablePromotionService,
};
