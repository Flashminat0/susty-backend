module.exports = (sequelize, Sequelize) => {
    const Otp_Number = sequelize.define(
        'otpnumbers',
        {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            userId: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            phoneNumber: {
                type: Sequelize.STRING(20),
            },
            otp: {
                type: Sequelize.STRING(50),
            },
        },
        {
            timestamps: true,
        }
    )

    return Otp_Number
}
