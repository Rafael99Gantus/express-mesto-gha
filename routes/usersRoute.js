const router = require('express').Router();

const { getUsers, getUsersId, postUser, patchMe, patchMyAvatar } = require ('../controllers/userController')

router.get('/', getUsers);
router.get('/:usersId', getUsersId);
router.post('/', postUser);
router.patch('/me', patchMe);
router.patch('/me/avatar', patchMyAvatar);


module.exports = router;