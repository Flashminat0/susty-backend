import express from 'express'
import {
    acceptRefund,
    declineRefund,
    listRefunds,
    searchRefund,
    viewRefundDetails,
    filterRefunds,
    filterRefundsOnCustomer,
} from '../controllers/refunds'
import { validateToken } from '../middlewares/user'

const router = express.Router()

router.get('/refunds/list-refunds', validateToken, listRefunds)
router.get('/refunds/filter-refunds', validateToken, filterRefunds)
router.get(
    '/refunds/filter-refunds-customer',
    validateToken,
    filterRefundsOnCustomer
)
router.get('/refunds/search-refund', validateToken, searchRefund)
router.put('/refunds/accept-refund', validateToken, acceptRefund)
router.put('/refunds/decline-refund', validateToken, declineRefund)
router.get('/refunds/get-details', viewRefundDetails)

module.exports = router
