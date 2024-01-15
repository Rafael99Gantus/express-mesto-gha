const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../utils/UnauthorizedError");

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Отсутствие токена"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "some-secret-key");
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
