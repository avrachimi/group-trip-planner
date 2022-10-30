const express = require('express');
const router  = express.Router();
const userController = require('../controllers/user');

router.get('/tea', userController.getAll);
router.post('/tea', );


module.exports = router;