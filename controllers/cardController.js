const http2 = require("http2");

const Card = require("../models/card");

const ERROR_500 = "Произошла ошибка";

const ERROR_404 = "Не найдено";

const ERROR_400 = "Переданы некорректные данные";

// module.exports.getCards = (req, res) => {
//   console.log("getCards");
//   Card.find({})
//     .then((cards) => res.send({ data: cards }))
//     .catch(() => res.status(500).send({ message: ERROR_500 }));
// };

module.exports.getCards = async (req, res) => {
  try {
    console.log("getCards");
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500, error: error.message });
  }
};

// module.exports.getCardsId = (req, res) => {
//   console.log("getCardsId");
//   Card.findById(req.params.cardId)
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.name === "DocumentNotFoundError") {
//         res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
//         return;
//       }
//       res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
//     });
// };

module.exports.getCardsId = async (req, res) => {
  try {
    console.log("getCardsId");
    const cardId = await Card.findById(req.params.cardId);
    return res.send(cardId);
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      return res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: ERROR_404, error: error.message });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500, error: error.message });
  }
};

module.exports.postCard = async (req, res) => {
  try {
    console.log("postCard");
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link });
    return res.send(newCard);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: ERROR_400, error: error.message });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500, error: error.message });
  }
};

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };

// module.exports.putLike = (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//     { new: true },
//   )
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.name === "DocumentNotFoundError") {
//         res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
//         return;
//       }
//       res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
//     });
// };

// module.exports.deleteLike = (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } }, // убрать _id из массива
//     { new: true },
//   )
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.name === "DocumentNotFoundError") {
//         res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
//         return;
//       }
//       res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
//     });
// };
