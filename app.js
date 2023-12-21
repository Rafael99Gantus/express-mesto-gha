const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/usersRoute');
const bodyParser = require('body-parser');
const { PORT = 9090, BASE_PATH } = process.env;

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

app.use('/users', router)
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(PORT);
});