module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('group', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true, // Keep table name same as model name
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Group;
};
