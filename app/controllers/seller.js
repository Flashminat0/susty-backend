import db from '../config/db.config'
import { Op } from 'sequelize'
import moment from 'moment'

const { Seller, Product, Site } = db

export const changeDescription = (req, res) => {
    const { sellerId, Description } = req.body

    Seller.update(
        {
            description: Description,
        },
        {
            where: {
                id: sellerId,
            },
        }
    )
        .then(() => {
            return res.status(200).json({
                success: true,
                message: 'Description changed successfully',
            })
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while changing description',
                error: error.message,
            })
        })
}

export const removeStore = (req, res) => {
    const { sellerId } = req.body

    Seller.destroy({
        where: {
            id: sellerId,
        },
    })
        .then(() => {
            return res.status(200).json({
                success: true,
                message: 'Store removed successfully',
            })
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while removing store',
                error: error.message,
            })
        })
}

export const changeLocation = (req, res) => {
    const { userId, location } = req.body

    Seller.update(
        {
            location: location,
        },
        {
            where: {
                userId: userId,
            },
        }
    )
        .then(() => {
            return res.status(200).json({
                success: true,
                message: 'Location changed successfully',
            })
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while changing location',
                error: error.message,
            })
        })
}

export const filterProducts = (req, res) => {
    const { userId } = req.body
    const filters = req.query

    for (const queryKey in filters) {
        if (
            filters[queryKey] === '' ||
            filters[queryKey] === null ||
            filters[queryKey] === undefined
        ) {
            delete filters[queryKey]
        }
    }

    if (filters.stockMin || filters.stockMax) {
        filters.stock = {
            [Op.between]: [
                filters.stockMin ? parseInt(filters.stockMin) : 0,
                filters.stockMax ? parseInt(filters.stockMax) : 99999,
            ],
        }
        delete filters.stockMin
        delete filters.stockMax
    }

    if (filters.priceMin || filters.priceMax) {
        filters.price = {
            [Op.between]: [
                filters.priceMin ? parseInt(filters.priceMin) : 0,
                filters.priceMax ? parseInt(filters.priceMax) : 99999,
            ],
        }
        delete filters.priceMin
        delete filters.priceMax
    }

    Product.findAll({
        where: {
            sellerId: userId,
            ...filters,
        },
    })
        .then((products) => {
            return res.status(200).json({
                success: true,
                message: 'Products filtered successfully',
                products: products,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while filtering products',
                error: error.message,
            })
        })
}

export const getSellerNotice = (req, res) => {
    Site.findOne({
        where: {
            id: 1,
        },
    })
        .then((site) => {
            return res.status(200).json(site.sellerNotice)
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            })
        })
}

export const getStoreInfo = (req, res) => {
    const { userId } = req.body

    Seller.findOne({
        where: {
            userId: userId,
        },
    })
        .then((seller) => {
            return res.status(200).json({
                success: true,
                message: 'Store info fetched successfully',
                store: seller,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while fetching store info',
                error: error.message,
            })
        })
}

export const changeStoreDescription = (req, res) => {
    const { userId } = req.body

    Seller.update(
        {
            storeDescription: req.body.storeDescription,
        },
        {
            where: {
                userId: userId,
            },
        }
    )
        .then(() => {
            Seller.findOne({
                where: {
                    userId: userId,
                },
            })
                .then((seller) => {
                    return res.status(200).json({
                        success: true,
                        message: 'Store info fetched successfully',
                        store: seller,
                    })
                })
                .catch((error) => {
                    return res.status(500).json({
                        success: false,
                        message: 'Error occurred while fetching store info',
                        error: error.message,
                    })
                })
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while changing store description',
                error: error.message,
            })
        })
}

export const getBankInfo = (req, res) => {
    const { userId } = req.body

    Seller.findOne({
        where: {
            userId: userId,
        },
    })
        .then((seller) => {
            return res.status(200).json({
                success: true,
                message: 'Bank info fetched successfully',
                bank: seller.bankDetails,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while fetching bank info',
                error: error.message,
            })
        })
}

export const changeBankInfo = (req, res) => {
    const { userId } = req.body

    Seller.update(
        {
            bankDetails: req.body.bankDetails,
        },
        {
            where: {
                userId: userId,
            },
        }
    )
        .then(() => {
            return res.status(200).json({
                success: true,
                message: 'Bank info changed successfully',
            })
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while changing bank info',
                error: error.message,
            })
        })
}
