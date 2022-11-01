const express = require('express');
const router  = express.Router();
const userController = require('../controllers/user');
const { authUser, authAdmin } = require('../middleware/auth');

router.get('/', (req, res) => res.redirect('/login')); // Not using home dir right now. Redirect to login

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.post('/logout', userController.postLogout);

router.get('/users', authAdmin, userController.getAll); // Not serving frontend

router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);

router.get('/account', authUser, userController.getAccount);

router.get('/account/edit', authUser, userController.getAccountEdit);
router.put('/account/edit', authUser, userController.updateAccount);
router.delete('/account', authUser, userController.deleteAccount); // FIXME:



module.exports = router;