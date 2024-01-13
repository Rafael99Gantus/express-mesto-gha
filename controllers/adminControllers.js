/* eslint-disable max-len */
const http2 = require("http2");

const bcrypt = require("bcryptjs");

const User = require("../models/user");

const SOLT_ROUND = 10;

const ERROR_500 = "Произошла ошибка";

module.exports.authAdmin = async (req, res) => {
  try {
    console.log("authAdmin");
    const { email, password } = req.body;
    const userAdmin = await User.findOne({ email }).orFail(new Error("NotAuth"));
    const matched = await bcrypt.compare(password, userAdmin.password);
    if(!matched){
      throw new Error("NotAuth");
    }
    return res.status(http2.constants.HTTP_STATUS_OK).send(userAdmin);
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};

module.exports.registerAdmin = async (req, res) => {
  try {
    console.log("registerAdmin");
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUND);
    const newAdmin = await User.create({ email, password: hash });
    return res.status(http2.constants.HTTP_STATUS_OK).send({ email: newAdmin.email, _id: newAdmin._id });
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};
