const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.use("/:productId/reviews", reviewRouter);
router
  .route("/top-5-cheap")
  .get(productController.aliasTopProducts, productController.getAllProducts);
router.route("/getTableProduct").get(productController.getTableProduct);
router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin", "employee"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "employee"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "employee"),
    productController.deleteProduct
  );

module.exports = router;
