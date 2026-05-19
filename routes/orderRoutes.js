const express = require("express")
const router = express.Router()
const { createOrder, myOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController')
const { protect } = require("../middleware/authmiddleware")
const { admin } = require("../middleware/admin.middleware")

router.post('/',           protect, createOrder)
router.get('/myorders',    protect, myOrders)          // ✅ myOrders not myorder
router.get('/',            protect, admin, getAllOrders) // ✅ getAllOrders not getOrder
router.put('/:id/status',  protect, admin, updateOrderStatus)

module.exports = router