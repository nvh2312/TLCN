const express = require("express");
const importController = require("./../controllers/importController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
authController.restrictTo("admin", "employee");
router.route("/getTableImport").get(importController.getTableImport);

router
  .route("/")
  .get(importController.getAllImports)
  .post(importController.createImport);
router
  .route("/:id")
  .get(importController.getImport)
  .patch(importController.updateImport);

module.exports = router;
