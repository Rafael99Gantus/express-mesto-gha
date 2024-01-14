/* eslint-disable max-len */
const http2 = require("http2");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const NotFoundError = require("../utils/NotFoundError");

const ERROR_500 = "Произошла ошибка";

const ERROR_404 = "Пользователь не найден";

const ERROR_401 = "Отсутствие токена";

const ERROR_400 = "Переданы некорректные данные";

const ERROR_11000 = "Такой пользователь уже существует";

const MONGO_DUBLICATE_ERROR_CODE = 11000;

module.exports.getUsers = async (req, res) => {
  try {
    console.log("getUsers");
    const users = await User.find({});
    return res.status(http2.constants.HTTP_STATUS_OK).send(users);
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

module.exports.getUsersId = async (req, res) => {
  try {
    const { usersId } = req.params;
    const userId = await User.findById(usersId).orFail(() => new NotFoundError(`${ERROR_404}`));
    return res.status(http2.constants.HTTP_STATUS_OK).send(userId);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: ERROR_400 });
    }
    if (error.name === "NotFoundError") {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: ERROR_404 });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500, error: error.name });
  }
};

module.exports.postUser = async (req, res) => {
  try {
    console.log("postUser");
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hashPassword,
    });
    return res.status(http2.constants.HTTP_STATUS_OK).json(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: ERROR_400 });
    }
    if (error.code === MONGO_DUBLICATE_ERROR_CODE) {
      return res
        .status(http2.constants.HTTP_STATUS_CONFLICT)
        .json({ message: ERROR_11000 });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
  }
};

module.exports.login = async (req, res) => {
  try {
    console.log("login");
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return Promise.reject(new Error("Неправильные почта или пароль"));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // хеши не совпали — отклоняем промис
      return Promise.reject(new Error("Неправильные почта или пароль"));
    }
    const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });
    return res.status(http2.constants.HTTP_STATUS_OK).send({ token, message: "Пользователь авторизован" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: ERROR_400 });
    }
    if (error.code === MONGO_DUBLICATE_ERROR_CODE) {
      return res
        .status(http2.constants.HTTP_STATUS_CONFLICT)
        .json({ message: ERROR_11000 });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
  }
};

module.exports.getMe = async (req, res) => {
  try {
    console.log("getMe");
    const userId = req.user._id;
    const me = await User.find({ userId });
    return res.status(http2.constants.HTTP_STATUS_OK).json({
      name: me.name,
      email: me.email,
      about: me.about,
      avatar: me.avatar,
    });
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};
