const express = require('express');
const router  = express.Router();
const destinationController = require('../controllers/destination');
const { authUser, authAdmin } = require('../middleware/auth');

router.get('/destinations', authUser, destinationController.getAll);

router.get('/destinations/new', authUser, destinationController.getDestinationsNew)
router.post('/destinations/new', authUser, destinationController.postDestinationsNew);

router.get('/destinations/:id', authUser, destinationController.getDestination);
router.put('/destinations/:id', authUser, destinationController.updateDestination);
router.delete('/destinations/:id', authUser, destinationController.deleteDestination);


module.exports = router;