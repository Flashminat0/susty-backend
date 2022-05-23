module.exports = (sequelize, Sequelize) => {
    const Favourites = sequelize.define(
        'favourites',
        {
            favouriteId: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            productId: {
                type: Sequelize.STRING(30),
                allowNull: false,
                primaryKey: false,
            },
            userId: {
                type: Sequelize.STRING(30),
                allowNull: false,
                primaryKey: false,
            },
        },
        {
            timestamps: true,
        }
    )

    return Favourites
}
