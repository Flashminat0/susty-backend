module.exports = (sequelize, Sequelize) => {
    const Refunds = sequelize.define(
        'refunds',
        {
            refundId: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            orderId: {
                type: Sequelize.STRING(50),
                autoIncrement: false,
            },
            buyerId: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            sellerId: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            productId: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            refundStatus: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            requestedDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            customerUsername: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            refundType: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
        },
        {
            timestamps: true,
        }
    )

    return Refunds
}
