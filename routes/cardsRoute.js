const router = require("express").Router();

const {
  getCards, getCardsId, postCard, deleteCard,
} = require("../controllers/cardController");

const { setLike, deleteLike } = require("../controllers/otherControllers");

router.get("/", getCards);
router.get("/:cardId", getCardsId);
router.post("/", postCard);
router.put("/:cardId/likes", setLike);
router.delete("/:cardId/likes", deleteLike);
router.delete("/:cardId", deleteCard);

module.exports = router;
