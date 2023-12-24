/* eslint-disable max-len */
const http2 = require("http2");

const User = require("../models/user");

const ERROR_500 = "Произошла ошибка";

const ERROR_404 = "Не найдено";

const ERROR_400 = "Переданы некорректные данные";

// module.exports.getUsers = (req, res) => {
//   console.log("getUsers");
//   User.find({})
//     .then((users) => res.send({ data: users }))
//     .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 }));
// };

module.exports.getUsers = async (req, res) => {
  try {
    console.log("getUsers");
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500, error: error.message });
  }
};

// module.exports.getUsersId = (req, res) => {
//   console.log("getUsersId");
//   User.findById(req.params._id)
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.name === "DocumentNotFoundError") {
//         res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
//         return;
//       }
//       res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
//     });
// };

module.exports.getUsersId = async (req, res) => {
  try {
    const userId = await User.findById(req.params.usersId);
    return res.send(userId);
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
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
    return res.send(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400, error: error.message });
    }
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500, error: error.message });
  }
};

// module.exports.patchMe = (req, res) => {
//   const { name, about } = req.body;
//   console.log(req.params.id);
//   User.findByIdAndUpdate(
//     req.params.id,
//     { name, about },
//     {
//       new: true, // обработчик then получит на вход обновлённую запись
//       runValidators: true,
//     },
//   )
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400 });
//         return;
//       }
//       if (err.name === "DocumentNotFoundError") {
//         res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
//         return;
//       }
//       res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
//     });
// };

// module.exports.patchMyAvatar = (req, res) => {
//   const { avatar } = req.body;
//   console.log(req.params.id);
//   User.findByIdAndUpdate(
//     req.params.id,
//     { avatar },
//     {
//       new: true,
//       runValidators: true,
//     },
//   )
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: ERROR_400 });
//         return;
//       }
//       if (err.name === "DocumentNotFoundError") {
//         res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ERROR_404 });
//         return;
//       }
//       res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ERROR_500 });
//     });
// };
