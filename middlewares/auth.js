const jwt = require("jsonwebtoken");

const http2 = require("http2");

const ERROR_500 = "Произошла ошибка";

const ERROR_401 = "Отсутствие токена";

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(http2.constants.HTTP_STATUS_DENIED)
      .json({ message: ERROR_401 });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, "some-secret-key");
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res
        .status(http2.constants.HTTP_STATUS_DENIED)
        .json({ message: ERROR_401 });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};
