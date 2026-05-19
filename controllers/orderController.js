const Order = require('../model/order.js')
const sendEmail = require('../utils/sendEmail.js')

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body

        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: 'Invalid order data' })
        }

        const order = new Order({
            user: req.user._id,
            products: items,
            totalAmount,
            address,
            paymentId
        })

        await order.save()

        const subject = 'Order Confirmation - Shoppy'
        const message = `Dear ${req.user.name},\n\nThank you for your order!\n\nOrder ID: ${order._id}\nTotal: ₹${totalAmount}\n\nBest regards,\nShoppy Team`

        await sendEmail(req.user.email, subject, message)

        res.status(201).json({ message: 'Order created successfully', order })

    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message })
    }
}

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product', 'name price')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await Order.findById(req.params.id)
        if (order) {
            order.status = status
            await order.save()
            res.json({ message: 'Order status updated', order })
        } else {
            res.status(404).json({ message: 'Order not found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message })
    }
}

module.exports = { createOrder, myOrders, getAllOrders, updateOrderStatus }