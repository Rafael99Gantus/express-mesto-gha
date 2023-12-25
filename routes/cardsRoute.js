const router = require("express").Router();

const {
  getCards, getCardsId, postCard, deleteCard,
} = require("../controllers/cardController");

const { changeLike } = require("../controllers/otherControllers");

router.get("/", getCards);
router.get("/:cardId", getCardsId);
router.post("/", postCard);
router.put("/:cardId/likes", changeLike);
router.delete("/:cardId/likes", changeLike);
router.delete("/:cardId", deleteCard);

module.exports = router;
