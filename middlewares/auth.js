const jwt = require("jsonwebtoken");

const http2 = require("http2");

const UnauthorizedError = require("../utils/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Требуется авторизация"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, "some-secret-key");
    req.user = payload;
    next();
    return res.status(http2.constants.HTTP_STATUS_OK).send("All okey");
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError("Требуется авторизация"));
  }
};
