import express from 'express'
import {authenticateToken, validateToken} from '../middlewares/user'

import {
    fetchAllOrders,
    fetchAllProducts,
    fetchAllRefunds,
    fetchAllUsers,
    fetchNotices,
    filterCustomers,
    filterOrders,
    filterRefunds,
    setCustomerNotice,
    setSellerNotice,
} from '../controllers/admin'

const router = express.Router()

router.post('/admin/edit-seller-notice', validateToken, setSellerNotice)
router.post('/admin/edit-customer-notice', validateToken, setCustomerNotice)
router.get('/admin/fetch-notices', validateToken, fetchNotices)
router.get('/admin/fetch-products', validateToken, fetchAllProducts)
router.get('/admin/fetch-users', validateToken, fetchAllUsers)
router.get('/admin/fetch-orders', validateToken, fetchAllOrders)
router.get('/admin/fetch-refunds', validateToken, fetchAllRefunds)

router.get('/admin/filter-customers', validateToken, filterCustomers)
router.get('/admin/filter-orders', validateToken, filterOrders)
router.get('/admin/filter-refunds', validateToken, filterRefunds)

module.exports = router
