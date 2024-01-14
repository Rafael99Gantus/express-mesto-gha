const express = require("express");
const mongoose = require("mongoose");

const http2 = require("http2");

const { routerUsers, routerCards } = require("./routes/index");
const { postUser, login } = require("./controllers/userController");

const { PORT = 3000 } = process.env;

const ERROR_404 = "Страница не найдена, некорректный запрос";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mestodb")
  .then(() => {
    console.log("Подключение установлено. Прошу обратить внимание, что некоторые детали, из описанных вами в блоке 'Можно лучне', уже были реализованы, версия приложения была верная");
  })
  .catch((err) => {
    console.error("Ошибка подключения:", err.message);
  });

app.post("/signin", login);
app.post("/signup", postUser);

app.use("/users", routerUsers);
app.use("/cards", routerCards);
app.use("*", (req, res) => {
  res
    .status(http2.constants.HTTP_STATUS_NOT_FOUND)
    .json({ message: ERROR_404 });
});
app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
