const express = require('express');
const router  = express.Router();
const groupController = require('../controllers/group');
const { authUser } = require('../middleware/auth');

router.get('/groups', authUser, groupController.getGroups);

router.get('/groups/new', authUser, groupController.getGroupsNew)
router.post('/groups/new', authUser, groupController.postGroupsNew);

router.delete('/groups/:id', authUser, groupController.deleteGroup);
router.get('/groups/:id/edit', authUser, groupController.getGroupEdit);
router.put('/groups/:id/edit', authUser, groupController.updateGroup);


module.exports = router;