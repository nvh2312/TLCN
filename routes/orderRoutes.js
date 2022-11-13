const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(authController.restrictTo("user"), orderController.createOrder);

router
  .route("/:id")
  .get(orderController.getOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
