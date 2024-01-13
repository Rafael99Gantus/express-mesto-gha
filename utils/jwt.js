const jwt = require("jsonwebtoken");

module.exports.generateToken = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(http2.constants.HTTP_STATUS_OK).send(users);
  } catch (error) {
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_500 });
  }
};