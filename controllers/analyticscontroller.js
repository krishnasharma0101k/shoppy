const order = require('../model/order')
const User = require('../model/user')
const Product = require('../model/product')

const getAdminstats = async(req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: 'user'})
        const totalOrders = await order.countDocuments({})
        const totalProducts = await Product.countDocuments({})

        const oders = await order.find({})

        const totalRvenueData = oders.reduce((acc, order) => acc + order.totalAmount, 0)

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRvenue: totalRvenueData
        })


    } catch (error) {
        res.status(500).json({message: "sever error"})
    }
}

module.exports = { getAdminstats}