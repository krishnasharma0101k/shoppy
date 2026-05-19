const express = require('express')
const {protect} = require("../middleware/authmiddleware")
const {admin} = require("../middleware/admin.middleware")
const {getAdminstats} = require("../controllers/analyticscontroller")

const router = express.Router()

router.get("/", protect, admin, getAdminstats)

module.exports = router 