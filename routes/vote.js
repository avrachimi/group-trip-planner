const express = require('express');
const router  = express.Router();
const voteController = require('../controllers/vote');
const { authUser, authAdmin } = require('../middleware/auth');

// FIXME: Only for Admin, for now
router.get('/votes', authAdmin, voteController.getAll);
router.post('/votes', authAdmin, voteController.createOne);

router.get('/votes/:id', authAdmin, voteController.getOne);
router.put('/votes/:id', authAdmin, voteController.updateOne);
router.delete('/votes/:id', authAdmin, voteController.deleteOne);


module.exports = router;