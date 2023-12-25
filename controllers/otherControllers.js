const http2 = require("http2");

const Card = require("../models/card");

const User = require("../models/user");

const NotFoundError = require("../utils/NotFoundError");

const ERROR_500 = "Произошла ошибка";

const ERROR_404 = "Не найдено";

const ERROR_400 = "Переданы некорректные данные";

module.exports.changeLike = async (req, res) => {
  try {
    const cardId = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).orFail(new NotFoundError({ message: ERROR_404 }));
    res.status(http2.constants.HTTP_STATUS_OK).send(cardId);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400 });
      return;
    }
    if (error.name === "NotFoundError") {
      res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
      return;
    }
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
  }
};

module.exports.patchMe = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(new NotFoundError({ message: ERROR_404 }));
    res.status(http2.constants.HTTP_STATUS_OK).send(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400 });
      return;
    }
    if (error.name === "NotFoundError") {
      res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
      return;
    }
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
  }
};

module.exports.patchMyAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(new NotFoundError({ message: ERROR_404 }));
    res.status(http2.constants.HTTP_STATUS_OK).send(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400 });
      return;
    }
    if (error.name === "NotFoundError") {
      res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
      return;
    }
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
  }
};
