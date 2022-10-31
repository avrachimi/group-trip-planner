const express = require('express');
const router  = express.Router();
const voteController = require('../controllers/vote');

router.get('/votes', voteController.getAll);
router.post('/votes', voteController.createOne);

router.get('/votes/:id', voteController.getOne);
router.put('/votes/:id', voteController.updateOne);
router.delete('/votes/:id', voteController.deleteOne);


module.exports = router;