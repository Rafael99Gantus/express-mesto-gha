const adminRoutes = require("express").Router();

const {
  authAdmin, registerAdmin,
} = require("../controllers/adminControllers");

adminRoutes.post("/auth", authAdmin);
adminRoutes.post("/register", registerAdmin);

module.exports = adminRoutes;
