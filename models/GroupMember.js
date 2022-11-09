module.exports = (sequelize, DataTypes) => {
    const GroupMember = sequelize.define('group_member', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    }, {
        freezeTableName: true, // Keep table name same as model name
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return GroupMember;
};
