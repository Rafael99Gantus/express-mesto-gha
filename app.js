const express = require("express");
const http2 = require("http2");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { routerUsers, routerCards } = require("./routes/index");

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/mestodb")
  .then(() => {
    console.log("Подключение установлено");
  })
  .catch((err) => {
    console.error("Ошибка подключения:", err.message);
  });
app.use((req, res, next) => {
  req.user = {
    _id: "65848aec59f92c95bec45120",
  };

  next();
});
app.use("/users", routerUsers);
app.use("/cards", routerCards);
app.use("*", (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).json({ message: "Страница не найдена" });
});
app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
