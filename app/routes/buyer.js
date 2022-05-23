import express from 'express'

import { validateToken } from '../middlewares/user'
import {
    fetchOrdersByCustomer,
    cancelOrder,
    SearchOrder,
} from '../controllers/buyer'

const router = express.Router()

router.get('/customers/fetch-orders', validateToken, fetchOrdersByCustomer)
router.get('/customers/search-orders', validateToken, SearchOrder)

module.exports = router
