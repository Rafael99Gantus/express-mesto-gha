/* eslint-disable max-len */
const http2 = require("http2");

const User = require("../models/user");

const ERROR_500 = "Произошла ошибка";

const ERROR_404 = "Не найдено";

const ERROR_400 = "Переданы некорректные данные";

module.exports.getUsers = async (req, res) => {
  try {
    console.log("getUsers");
    const users = await User.find({});
    return res.status(http2.constants.HTTP_STATUS_OK).send(users);
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500, error: error.message });
  }
};

module.exports.getUsersId = async (req, res) => {
  try {
    const userId = await User.findById(req.params.usersId);
    return res.status(http2.constants.HTTP_STATUS_OK).send(userId);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404, error: error.message });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500, error: error.message });
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
      return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400, error: error.message });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500, error: error.message });
  }
};
