const express = require('express');
const router  = express.Router();
const userController = require('../controllers/user');

router.get('/users', userController.getAll);
router.post('/users', userController.createOne);

router.get('/users/:id', userController.getOne);
router.put('/users/:id', userController.updateOne);
router.delete('/users/:id', userController.deleteOne);


module.exports = router;