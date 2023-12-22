const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/usersRoute');
const routerCards = require('./routes/cardsRoute');
const bodyParser = require('body-parser');
const { PORT = 3000, BASE_PATH } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/mestodb")
  .then(() => {
    console.log("Подключение установлено");
  })
  .catch((err) => {
    console.error("Ошибка подключения:", err.message);
  });

app.use('/users', routerUsers)
app.use('/cards', routerCards)
app.use((req, res, next) => {
  req.user = {
    _id: '65848aec59f92c95bec45120' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(PORT);
});