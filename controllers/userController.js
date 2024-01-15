/* eslint-disable max-len */
const http2 = require("http2");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const NotFoundError = require("../utils/NotFoundError");
const UnauthorizedError = require("../utils/UnauthorizedError");

// const ERROR_500 = "Произошла ошибка";
const ERROR_404 = "Пользователь не найден";
// const ERROR_401 = "Отсутствие токена";
// const ERROR_400 = "Переданы некорректные данные";
// const ERROR_11000 = "Такой пользователь уже существует";
// const MONGO_DUBLICATE_ERROR_CODE = 11000;

module.exports.getUsers = async (req, res, next) => {
  try {
    console.log("getUsers");
    const users = await User.find({});
    res.status(http2.constants.HTTP_STATUS_OK).send(users);
  } catch (err) {
    // if (error.name === "UnauthorizedError") {
    //   return res
    //     .status(http2.constants.HTTP_STATUS_DENIED)
    //     .json({ message: ERROR_401 });
    // }
    // return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: ERROR_500 });
    next(err);
  }
};

module.exports.getUsersId = async (req, res, next) => {
  try {
    const { usersId } = req.params;
    const userId = await User.findById(usersId).orFail(() => new NotFoundError(`${ERROR_404}`));
    res.status(http2.constants.HTTP_STATUS_OK).send(userId);
  } catch (err) {
    next(err);
  }
};

module.exports.postUser = async (req, res, next) => {
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
    res.status(http2.constants.HTTP_STATUS_OK).json(newUser);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.login = async (req, res, next) => {
  try {
    console.log("login");
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password").orFail(() => new UnauthorizedError(`${ERROR_404}`));
    // if (!user) {
    //   throw new UnauthorizedError("Неправильные почта или пароль");
    // }
    await bcrypt.compare(password, user.password).orFail(() => new UnauthorizedError(`${ERROR_404}`));
    // if (!matched) {
    //   // хеши не совпали — отклоняем промис
    //   throw new UnauthorizedError("Неправильные почта или пароль");
    // }
    const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });
    res.status(http2.constants.HTTP_STATUS_OK).send({ token, message: "Пользователь авторизован" });
  } catch (err) {
    next(err);
  }
  // if (error.name === "ValidationError") {
  //   return res
  //     .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
  //     .json({ message: ERROR_400 });
  // }
  // if (error.code === MONGO_DUBLICATE_ERROR_CODE) {
  //   return res
  //     .status(http2.constants.HTTP_STATUS_CONFLICT)
  //     .json({ message: ERROR_11000 });
  // }
  // return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
};

module.exports.getMe = async (req, res, next) => {
  try {
    console.log("getMe");
    const userId = req.user._id;
    const me = await User.find({ userId }).orFail(() => new NotFoundError(`${ERROR_404}`));
    res.status(http2.constants.HTTP_STATUS_OK).json({
      name: me.name,
      email: me.email,
      about: me.about,
      avatar: me.avatar,
    });
  } catch (err) {
    next(err);
  }
};
