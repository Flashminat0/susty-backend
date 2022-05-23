module.exports = (sequelize, Sequelize) => {
    const Seller = sequelize.define(
        'seller',
        {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            storeName: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            storeUserName: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            storeImage: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            storeDescription: {
                type: Sequelize.STRING(500),
                allowNull: true,
                defaultValue: '',
            },
            bankDetails: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: {
                    accountName: '',
                    accountNumberValidation: '',
                    bankName: '',
                    bankAddress: '',
                    routingNumberValidation: '',
                    ibanNumberValidation: '',
                    swiftCodeValidation: '',
                    ifscCodeValidation: '',
                },
            },
            location: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: {
                    City: '',
                    Address: '',
                    Country: '',
                    ZipCode: '',
                },
            },
        },
        {
            timestamps: true,
        }
    )
    return Seller
}
