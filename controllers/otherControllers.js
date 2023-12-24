const http2 = require("http2");

const Card = require("../models/card");

const User = require("../models/user");

const ERROR_500 = "Произошла ошибка";

const ERROR_404 = "Не найдено";

const ERROR_400 = "Переданы некорректные данные";

module.exports.changeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
    });
};

module.exports.patchMe = (req, res) => {
  const { name, about } = req.body;
  console.log(req.params.id);
  User.findByIdAndUpdate(
    req.params.id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400 });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
    });
};

module.exports.patchMyAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(req.params.id);
  User.findByIdAndUpdate(
    req.params.id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400 });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
    });
};
