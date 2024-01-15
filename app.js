const express = require("express");
const mongoose = require("mongoose");

const http2 = require("http2");

const { routerUsers, routerCards } = require("./routes/index");
const { postUser, login } = require("./controllers/userController");
const errorHandler = require("./middlewares/error");
const { signUpValidation, signInValidation } = require("./middlewares/celebrate");

const ERROR_404 = "Страница не найдена, некорректный запрос";
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mestodb")
  .then(() => {
    console.log("Подключение установлено");
  })
  .catch((err) => {
    console.error("Ошибка подключения:", err.message);
  });

app.post("/signin", signInValidation, login);
app.post("/signup", signUpValidation, postUser);

app.use("/users", routerUsers);
app.use("/cards", routerCards);
app.use("*", (req, res) => {
  res
    .status(http2.constants.HTTP_STATUS_NOT_FOUND)
    .json({ message: ERROR_404 });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
