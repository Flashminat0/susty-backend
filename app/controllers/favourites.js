import {customAlphabet} from "nanoid";

const db = require('../config/db.config');
const {Favourites} = db;


// Favourites
export const getAllFavourites = (req, res) => {
    let {userId} = req.body;

    Favourites.findAll({
        where: {
            userId: userId
        }
    }).then(favourites => {
        return res.status(200).json(favourites);
    }).catch(err => {
        return res.status(400).json({
            message: 'Error',
            error: err
        });
    });
}


export const addFavourite = (req, res) => {
    let {userId, productId} = req.body;

    Favourites.create({
        favouriteId: customAlphabet('0123456789', 10)(),
        userId: userId,
        productId: productId
    }).then(favourite => {
        return res.status(200).json(favourite);
    }).catch(err => {
        return res.status(400).json({
            message: 'Error',
            error: err
        });
    });

}

export const removeFavourite = (req, res) => {
    let {userId, favouriteId} = req.body;

    Favourites.delete({
        where: {
            userId: userId,
            favouriteId: favouriteId
        }
    }).then(() => {
        return res.status(200).json({
            message: 'Favourite deleted'
        });
    }).catch(err => {
        return res.status(400).json({
            message: 'Error',
            error: err
        });
    });

}