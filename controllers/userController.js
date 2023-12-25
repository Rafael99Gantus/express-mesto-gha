/* eslint-disable max-len */
const http2 = require("http2");

const User = require("../models/user");

const NotFoundError = require("../utils/NotFoundError");

const ERROR_500 = "Произошла ошибка";

const ERROR_404 = "Пользователь не найден";

const ERROR_400 = "Переданы некорректные данные";

module.exports.getUsers = async (req, res) => {
  try {
    console.log("getUsers");
    const users = await User.find({});
    return res.status(http2.constants.HTTP_STATUS_OK).send(users);
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};

module.exports.getUsersId = async (req, res) => {
  try {
    const { usersId } = req.params;
    const userId = await User.findById(usersId).orFail(() => new NotFoundError(`${ERROR_404}`));
    return res.status(http2.constants.HTTP_STATUS_OK).send(userId);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: ERROR_400 });
    }
    if (error.name === "NotFoundError") {
      return res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: ERROR_404 });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500, error: error.name });
  }
};

module.exports.postUser = async (req, res) => {
  try {
    console.log("postUser");
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(http2.constants.HTTP_STATUS_OK).send(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: ERROR_400 });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
  }
};
