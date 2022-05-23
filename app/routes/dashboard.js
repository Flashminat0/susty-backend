import express from 'express'
import { authenticateToken, validateToken } from '../middlewares/user'
import {
    getOrderSummery,
    getProductSummery,
    getCustomerInsight,
    getRefundStatus,
    getWalletDetails,
} from '../controllers/dashboard'

const router = express.Router()

//get user details
router.get('/dashboard/get-order-summery', validateToken, getOrderSummery)
router.get('/dashboard/get-product-summery', validateToken, getProductSummery)
//todo reviews
router.get('/dashboard/get-customer-insight', validateToken, getCustomerInsight)
router.get('/dashboard/get-refund-status', validateToken, getRefundStatus)
router.get('/dashboard/get-wallet-details', validateToken, getWalletDetails)

module.exports = router
