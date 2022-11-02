const express = require('express');
const router  = express.Router();
const destinationController = require('../controllers/destination');
const { authUser, authAdmin } = require('../middleware/auth');

router.get('/destinations', authUser, destinationController.getDestinations);

router.get('/destinations/new', authUser, destinationController.getDestinationsNew)
router.post('/destinations/new', authUser, destinationController.postDestinationsNew);

router.get('/destinations/:id', authUser, destinationController.getDestination);
router.delete('/destinations/:id', authUser, destinationController.deleteDestination);
router.get('/destinations/:id/edit', authUser, destinationController.getDestinationEdit);
router.put('/destinations/:id/edit', authUser, destinationController.updateDestination);


module.exports = router;