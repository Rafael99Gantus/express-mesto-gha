const router = require('express').Router();

const {createCard, getCards, getCardsId, postCard} = require ('../controllers/cardController');

router.get('/', getCards);
router.get('/:cardId', getCardsId);
router.post('/', postCard);

module.exports = router;