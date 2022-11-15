const express = require('express');
const router  = express.Router();
const groupController = require('../controllers/group');
const { authUser } = require('../middleware/auth');

router.get('/groups', authUser, groupController.getGroups);

router.get('/groups/new', authUser, groupController.getGroupsNew)
router.post('/groups/new', authUser, groupController.postGroupsNew);

router.get('/groups/:id', authUser, groupController.getGroup);
// Not in use by frontend, for now
//router.put('/groups/:id/edit-name', authUser, groupController.updateGroupName);
//router.post('/groups/:id/add-member', authUser, groupController.postGroupMember);

router.delete('/groups/:id', authUser, groupController.deleteGroup);
router.delete('/groups/:group_id/members/:member_id', authUser, groupController.deleteGroupMember);


module.exports = router;