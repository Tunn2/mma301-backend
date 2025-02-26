const jwt = require("jsonwebtoken");
const { findUserByIdService } = require("../services/user.service");

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(403).json({ message: "Unauthorized" });
  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = _id;
    return next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return res.status(401).json({ errorCode: 1, message: "Token expired" });
    }
    return res.status(403).json({ errorCode: 1, message: "Unauthorized" });
  }
};

const checkAdminRole = async (req, res, next) => {
  const user = await findUserByIdService(req.userId);
  if (user.role === "ADMIN") {
    return next();
  }

  return res
    .status(403)
    .json({
      errorCode: 1,
      message: "You do not have permission to do this action",
    });
};

module.exports = {
  authenticate,
  checkAdminRole,
};
