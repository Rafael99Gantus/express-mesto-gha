const router = require("express").Router();

const { getUsers, getUsersId, getMe } = require("../controllers/userController");
const { patchMe, patchMyAvatar } = require("../controllers/otherControllers");
const auth = require("../middlewares/auth");

router.get("/", auth, getUsers);
router.get("/:usersId", auth, getUsersId);
router.patch("/me", auth, patchMe);
router.get("/me", auth, getMe);
router.patch("/me/avatar", auth, patchMyAvatar);

module.exports = router;
