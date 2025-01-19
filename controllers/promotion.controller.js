const {
  createPromotionService,
  getPromotionsService,
  getPromotionByIdService,
} = require("../services/promotion.service");

const createPromotionController = async (req, res) => {
  try {
    const { code, rate, startDate, endDate } = req.body;
    return res.send(
      await createPromotionService({ code, rate, startDate, endDate })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getPromotionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    return res.send(await getPromotionByIdService(id));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getPromotionsController = async (req, res) => {
  try {
    const { search, limit, page } = req.query;
    return res.send(await getPromotionsService({ search, limit, page }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createPromotionController,
  getPromotionsController,
  getPromotionByIdController,
};
