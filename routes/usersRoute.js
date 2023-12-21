const router = require('express').Router();

const { getUsers, getUsersId, postUser } = require ('../controllers/userController')

router.get('/', getUsers);
router.get('/:usersId', getUsersId);
router.post('/', postUser);


module.exports = router;