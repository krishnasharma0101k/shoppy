const express = require("express");

const { protect } = require("../middleware/authmiddleware.js");
const { admin } = require("../middleware/admin.middleware.js");
const { updateOne } = require("../model/user.js");
// const multer = require("multer");
// const upload = multer({ dest: "upload/s3upload" });
const upload = require("../middleware/multer.middleware.js")
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productcontroller.js");
// console.log(registerUser);
// console.log(loginUser);
// console.log(getUsers);
// console.log(protect);
// console.log(admin);

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.single("image"), createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
