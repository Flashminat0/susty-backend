module.exports = (sequelize, Sequelize) => {
    const Wallet = sequelize.define(
        'wallet',
        {
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            earnings: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            withdrawals: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            balance: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            currency: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'USD',
            },
        },
        {
            timestamps: true,
        }
    )

    return Wallet
}
