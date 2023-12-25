const http2 = require("http2");

const Card = require("../models/card");

const NotFoundError = require("../utils/NotFoundError");

const ERROR_500 = "Произошла ошибка";

const ERROR_404 = "Карточка не найдена";

const ERROR_400 = "Переданы некорректные данные";

module.exports.getCards = async (req, res) => {
  try {
    console.log("getCards");
    const cards = await Card.find({});
    return res.status(http2.constants.HTTP_STATUS_OK).send(cards);
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};

module.exports.getCardsId = async (req, res) => {
  try {
    console.log("getCardsId");
    const cardId = await Card.findById(req.params.cardId).orFail(() => new NotFoundError(`${ERROR_404}`));
    return res.status(http2.constants.HTTP_STATUS_OK).send(cardId);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: ERROR_400 });
    }
    if (error.name === "NotFoundError") {
      return res.status(404)
        .send({ message: ERROR_404 });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};

module.exports.postCard = async (req, res) => {
  try {
    console.log("postCard");
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link });
    return res.status(http2.constants.HTTP_STATUS_OK).send(newCard);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: ERROR_400 });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};
