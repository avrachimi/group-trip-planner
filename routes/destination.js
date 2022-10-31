const express = require('express');
const router  = express.Router();
const destinationController = require('../controllers/destination');

router.get('/destinations', destinationController.getAll);
router.post('/destinations', destinationController.createOne);

router.get('/destinations/:id', destinationController.getOne);
router.put('/destinations/:id', destinationController.updateOne);
router.delete('/destinations/:id', destinationController.deleteOne);


module.exports = router;