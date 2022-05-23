module.exports = (sequelize, Sequelize) => {
    const Site = sequelize.define(
        'site',
        {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
                autoIncrement: true,
            },
            sellerNotice: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            customerNotice: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
        },
        {
            timestamps: false,
        }
    )
    return Site
}
