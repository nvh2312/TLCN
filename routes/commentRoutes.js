const express = require("express");
const commentController = require("./../controllers/commentController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(commentController.getAllComments)
  .post(
    authController.restrictTo("user", "employee", "admin"),
    commentController.setProductUserIds,
    commentController.createComment
  );
router.route("/getTableComment").get(commentController.getTableComment);
router
  .route("/:id")
  .get(commentController.getComment)
  .patch(
    authController.restrictTo("user", "employee", "admin"),
    commentController.isOwner,
    commentController.updateComment
  )
  .delete(
    authController.restrictTo("user", "employee", "admin"),
    commentController.isOwner,
    commentController.deleteComment
  );

module.exports = router;
