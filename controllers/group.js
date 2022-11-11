const db = require('../models');
const Group = db['group'];
const GroupMember = db['group_member'];
const Destination = db['destination'];
const User = db['user'];

// GET /groups
// Auth: User
const getGroups = async (req, res, next) => {
    const user_id = req.session.user_id;
    const user = await User.findByPk(user_id);
    if (!user) return res.redirect('/login');

    // Accessing group, group_member and group_admin data through GroupMember model
    const group_members = await GroupMember.findAll({
        where: {
            email: user.email
        },
        attributes: [],
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'admin_user_id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'last_name']
                    },
                    {
                        model: GroupMember,
                        attributes: ['id', 'email']
                    }
                ]
            }
        ]
    });
    console.log(group_members);
    //res.json({ groups: group_members, user_id: user.id });
    res.render('groups', { groups: group_members, user_id: user.id });
};

// GET /groups/new
// Auth: User
const getGroupsNew = async (req, res, next) => {
    const user_id = req.session.user_id;
    const user = await User.findByPk(user_id);
    if (!user) return res.redirect('/login');

    res.render('group_new', { email: user.email });
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
    }).then(group => {
        const group_member_emails = req.body.email;
        try {
            if (Array.isArray(group_member_emails)) {
                group_member_emails.forEach(email => {
                    GroupMember.create({
                        email: email,
                        group_id: group.id
                    }).then(member => {
                        console.log(`${member.email} added to group ${group.name}`);
                    });
                });
            }
            else { // Only Group Admin email provided
                GroupMember.create({
                    email: group_member_emails,
                    group_id: group.id
                }).then(member => {
                    console.log(`${member.email} added to group ${group.name}`);
                });
            }
            res.redirect(`/groups`);
        } catch (err) {
            console.log(err);
            //res.send(err);
            res.render('group_new', { message: "Something went wrong. Please try again.", email: user.email });
        }
    }).catch(err => {
        console.log(err);
        //res.send(err);
        res.render('group_new', { message: "Something went wrong. Please try again.", email: user.email });
    });
};

// GET /groups/:id
// Auth: User
const getGroup = async (req, res, next) => {
    const user_id = req.session.user_id;
    const user = await User.findByPk(user_id);
    if (!user) return res.redirect('/login');

    //FIXME: needs work. only allow user on this page is they are a member of this group
    const group = await Group.findByPk(req.params.id, { 
        include: [
            {
                model: GroupMember,
                where: {
                    email: user.email
                }
            }, 
            {
                model: User,
                attributes: ['id']
            },
            {
                model: Destination
            }
        ] 
    });
    if (!group) return res.redirect('/groups');

    const group_members = await GroupMember.findAll({
        where: {
            group_id: group.id
        },
        attributes: ['id', 'email']
    });
    
    //res.json({group: group, group_members: group_members});
    res.render('group_view', { group: group, group_members: group_members });
};

// PUT /groups/:id/edit-name
// Auth: User
const updateGroupName = async (req, res, next) => {
    const group = await Group.findByPk(req.params.id);
    if (group.admin_user_id !== req.session.user_id) return redirect(`/groups/${group.id}`);

    Group.update({
        name: req.body.name
    }, {
        where: {
            id: req.params.id,
            admin_user_id: req.session.user_id
        }
    }).then(() => {
        console.log(`Group (id:${req.params.id}) has been updated succesfully`);
        return res.redirect(`/groups/${req.params.id}`);
    }).catch(err => {
        console.log(err);
        return res.redirect(`/groups/${req.params.id}`); // TODO: Add error message
    });
};

// POST /groups/:id/add-member
// Auth: User
const postGroupMember = async (req, res, next) => {
    const group = await Group.findByPk(req.params.id);
    if (group.admin_user_id !== req.session.user_id) return redirect(`/groups/${group.id}`);

    const member = await GroupMember.findOne({
        where: {
            email: req.body.email,
            group_id: req.params.id
        }
    });
    if (member) return res.render('group_view', {message: `Group member with email ${req.body.email} already exists in this group.`});

    GroupMember.create({
        email: req.body.email,
        group_id: req.params.id
    }).then(() => {
        console.log(`Group Member ${req.body.email}) has been added to ${group.name} group`);
        return res.redirect(`/groups/${req.params.id}`);
    }).catch(err => {
        console.log(err);
        return res.redirect(`/groups/${req.params.id}`); // TODO: Add error message
    });
};

// DELETE /groups/:id
// Auth: User
const deleteGroup = async (req, res, next) => {
    const group = await Group.findByPk(req.params.id);
    if (group.admin_user_id !== req.session.user_id) return redirect(`/groups/${group.id}`);

    Group.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        console.log(`Deleted Group with Id ${req.params.id}`);
        res.json({ isDeleted: true });
    }).catch(err => {
        console.log(err);
        res.json({ isDeleted: false });
    });

};

// DELETE /groups/:group_id/members/:member_id
// Auth: User
const deleteGroupMember = async (req, res, next) => {
    const group = await Group.findByPk(req.params.group_id);
    if (!group || group.admin_user_id !== req.session.user_id) return res.redirect('/groups');

    GroupMember.destroy({
        where: {
            id: req.params.member_id
        }
    }).then(() => {
        console.log(`Deleted Group Member with Id ${req.params.member_id}`);
        res.json({ isDeleted: true });
    }).catch(err => {
        console.log(err);
        res.json({ isDeleted: false });
    });

};

module.exports = {
    getGroups,
    getGroupsNew,
    postGroupsNew,
    getGroup,
    updateGroupName,
    postGroupMember,
    deleteGroup,
    deleteGroupMember
}