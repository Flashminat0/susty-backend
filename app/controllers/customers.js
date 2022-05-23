import { Op } from 'sequelize'
import moment from 'moment'

const db = require('../config/db.config')
const { Customer } = db

export const getSellerCustomers = (req, res) => {
    const { userId } = req.body

    Customer.findAll({
        where: {
            sellerId: userId,
        },
    })
        .then((customers) => {
            res.json(customers)
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            })
        })
}

export const filterCustomers = (req, res) => {
    const { userId } = req.body
    const filters = req.query

    if (filters.startDate || filters.endDate) {
        filters.updatedAt = {
            [Op.between]: [
                req.query.startDate
                    ? new Date(moment(req.query.startDate).format('YYYY-MM-DD'))
                    : new Date(moment('1980-01-01').format('YYYY-MM-DD')),
                req.query.endDate
                    ? new Date(moment(req.query.endDate).format('YYYY-MM-DD'))
                    : new Date(moment('2050-01-01').format('YYYY-MM-DD')),
            ],
        }
        delete filters.startDate
        delete filters.endDate
    }

    if (filters.stockMin || filters.stockMax) {
        filters.totalOrders = {
            [Op.between]: [
                req.query.stockMin ? req.query.stockMin : '0',
                req.query.stockMax ? req.query.stockMax : '99999',
            ],
        }
        delete filters.stockMin
        delete filters.stockMax
    }

    if (filters.priceMin || filters.priceMax) {
        filters.totalAmount = {
            [Op.between]: [
                req.query.priceMin ? req.query.priceMin : '0',
                req.query.priceMax ? req.query.priceMax : '99999',
            ],
        }
        delete filters.priceMin
        delete filters.priceMax
    }

    for (const queryKey in filters) {
        if (
            filters[queryKey] === '' ||
            filters[queryKey] === null ||
            filters[queryKey] === undefined
        ) {
            delete filters[queryKey]
        }
    }

    Customer.findAll({
        where: {
            sellerId: userId,
            ...filters,
        },
        order: [['userId', 'DESC']],
    })
        .then((customers) => {
            return res.status(200).json(customers)
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            })
        })
}
