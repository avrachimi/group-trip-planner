const db = require('../models');
const Group = db['group'];
const GroupMember = db['group_member'];
const User = db['user'];

// GET /groups
// Auth: User
const getGroups = async (req, res, next) => {
    const user_id = req.session.user_id;
    const user = await User.findByPk(user_id);
    if (!user) return res.redirect('/login');

    const groups = await Group.findAll({ 
        include: [{
            model: GroupMember,
            through: {
                where: {
                    email: user.email
                }
            }
        }]
    });
    res.render('groups', { groups: groups });
};

// GET /groups/new
// Auth: User
const getGroupsNew = (req, res, next) => {
    res.render('group_new');
};

// POST /groups/new
// Auth: User
const postGroupsNew = async (req, res, next) => {
    const user_id = req.session.user_id;
    const user = await User.findByPk(user_id);
    if (!user) return res.redirect('/login');

    Group.create({
        name: req.body.name,
        admin_user_id: user.id
    }).then(group =>{
        console.log('created group');
        const group_member_emails = req.body.email;
        try {
            group_member_emails.forEach(email => {
                GroupMember.create({ email: email}).then( member => {
                    group.addGroupMember(member).then(() => {
                        console.log(`${email} added as group member`);
                    });
                });
            });
            res.redirect(`/groups`);
        } catch (err) {
            console.log(err);
            res.render('group_new', { message: "Something went wrong. Please try again." });
        }
    }).catch(err => {
        console.log(err);
        res.render('group_new', { message: "Something went wrong. Please try again." });
    });
};

// GET /groups/:id/edit
// Auth: User
const getGroupEdit = async (req, res, next) => {
    const group = await Group.findByPk(req.params.id, { include: GroupMember });
    if (!group) return res.redirect('/groups');

    res.render('group_edit', { group: group });
};

// PUT /groups/:id/edit
// Auth: User
const updateGroup = async (req, res, next) => {
    const group = await Group.findOne({
        where: {
            id: req.params.id,
            admin_user_id: 1 //TODO: req.session.user_id
        },
        include: GroupMember
    });
    if (!group) return res.redirect('/groups');

    group.name = req.body.name;
    await group.save();

    const groupMembers = group.group_members;
    console.log(groupMembers);

    /*
    Group.update({
        name: req.body.name
    }, {
        where: {
            id: req.params.id,
            admin_user_id: req.session.user_id
        },
        include: GroupMember
    }).then(() => {
        console.log(`Group (id:${req.params.id}) has been updated succesfully`);
        return res.redirect(`/groups/${req.params.id}`);
    }).catch(err => {
        console.log(err);
        return res.redirect(`/groups/${req.params.id}/edit`);
    });
    */
};

// DELETE /groups/:id
// Auth: User
const deleteGroup = (req, res, next) => {

    Group.destroy({
        where: {
            id: req.params.id,
            user_id: req.session.user_id
        }
    }).then(() => {
        console.log(`Deleted Group with Id ${req.params.id}`);
        res.json({ isDeleted: true });
    }).catch(err => {
        console.log(err);
        res.json({ isDeleted: false });
    });

};

module.exports = {
    getGroups,
    postGroupsNew,
    getGroupEdit,
    updateGroup,
    deleteGroup,
    getGroupsNew
};