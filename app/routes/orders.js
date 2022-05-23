import express from 'express'
import {authenticateToken, validateToken} from '../middlewares/user'

import {
    filterOrders,
    listOrders,
    searchOrder,
    viewOrder,
    cancelPendingOrderBySeller,
    cancelOnProcessOrderBySeller,
    listCustomerOrders,
    filterOrdersCustomer,
} from '../controllers/orders'

const router = express.Router()

router.get('/orders/list-orders', validateToken, listOrders)
router.get('/orders/list-customer-orders', validateToken, listCustomerOrders)
router.get('/orders/filter-orders', validateToken, filterOrders)
router.get(
    '/orders/filter-orders-customer',
    validateToken,
    filterOrdersCustomer
)
router.put(
    '/orders/cancel-pending-order',
    validateToken,
    cancelPendingOrderBySeller
)
router.put(
    '/orders/cancel-onprocess-order',
    validateToken,
    cancelOnProcessOrderBySeller
)
router.get('/orders/view-order', viewOrder)
router.get('/orders/search', searchOrder)

module.exports = router
