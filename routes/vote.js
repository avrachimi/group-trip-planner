const express = require('express');
const router  = express.Router();
const voteController = require('../controllers/vote');
const { authUser, authAdmin } = require('../middleware/auth');

router.get('/votes', authUser, voteController.getVotes); // Only route serving frontend page
router.post('/votes/:choice', authUser, voteController.postVotes);

router.get('/votes/:id', authUser, voteController.getVote);
router.put('/votes/:id', authUser, voteController.updateVote);
router.delete('/votes/:id', authUser, voteController.deleteVote);


module.exports = router;