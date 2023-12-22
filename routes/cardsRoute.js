const router = require('express').Router();

const { createCard, getCards, getCardsId, postCard, putLike, deleteLike } = require('../controllers/cardController');

router.get('/', getCards);
router.get('/:cardId', getCardsId);
router.post('/', postCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;