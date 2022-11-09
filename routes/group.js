const express = require('express');
const router  = express.Router();
const groupController = require('../controllers/group');
const { authUser } = require('../middleware/auth');

router.get('/groups', authUser, groupController.getGroups);

router.get('/groups/new', authUser, groupController.getGroupsNew)
router.post('/groups/new', authUser, groupController.postGroupsNew);

router.delete('/groups/:id', authUser, groupController.deleteGroup);
router.get('/groups/:id/edit', groupController.getGroupEdit); //TODO: Add Auth back
router.put('/groups/:id/edit', authUser, groupController.updateGroup);
router.delete('/groups/:group_id/members/:member_id', groupController.deleteGroupMember); //TODO: Add Auth back


module.exports = router;