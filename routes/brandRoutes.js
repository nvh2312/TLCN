const express = require("express");
const brandController = require("./../controllers/brandController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(brandController.getAllBrands)
  .post(
    authController.restrictTo("employee", "admin"),
    brandController.createBrand
  );

router
  .route("/:id")
  .get(brandController.getBrand)
  .patch(
    authController.restrictTo("employee", "admin"),
    brandController.updateBrand
  )
  .delete(
    authController.restrictTo("employee", "admin"),
    brandController.deleteBrand
  );

module.exports = router;
