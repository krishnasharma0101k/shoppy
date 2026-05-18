const express = require("express");
const router = express.Router()
const { registerUser, loginUser, getUsers} = require("../controller/authController.js")
const {protect} = require('../middleware/authmiddleware.js')
const {admin} = require("../middleware/admin.middleware.js")

// console.log(registerUser);
// console.log(loginUser);
// console.log(getUsers);
// console.log(protect);
// console.log(admin);




router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/user", protect, admin, getUsers)


module.exports = router