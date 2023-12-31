const router = require("express").Router();

const {
  getUsers, getUsersId, postUser,
} = require("../controllers/userController");

const {
  patchMe, patchMyAvatar,
} = require("../controllers/otherControllers");

router.get("/", getUsers);
router.get("/:usersId", getUsersId);
router.post("/", postUser);
router.patch("/me", patchMe);
router.patch("/me/avatar", patchMyAvatar);

module.exports = router;
