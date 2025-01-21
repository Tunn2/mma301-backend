const {
  createChildService,
  getChildrenService,
} = require("../services/user.service");

const createChildController = async (req, res) => {
  try {
    const { username, age } = req.body;
    return res.send(
      await createChildService({ age, username, userId: req.userId })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getChildrenController = async (req, res) => {
  try {
    return res.send(await getChildrenService(req.userId));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = { createChildController, getChildrenController };
