const router = require("express").Router();
const validate = require("~/middlewares/validate");
const validateParams = require("~/middlewares/validateParams");

const authenticate = require("~/middlewares/auth");
const schemas = require("@/validations/comment");
const CommentController = require("@/controllers/Comment");

// GET COMMENT
router
  .route("/:id")
  .get(validateParams(schemas.idValidation), CommentController.find);

// GET COMMENTS
router
  .route("/book/:id")
  .get(validateParams(schemas.idValidation), CommentController.getComments);

// CREATE COMMENT
router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    CommentController.createComment
  );

// UPDATE COMMENT
router
  .route("/:id")
  .patch(
    authenticate,
    validateParams(schemas.idValidation),
    validate(schemas.updateValidation),
    CommentController.update
  );

// DELETE COMMENT
router
  .route("/:id")
  .delete(
    authenticate,
    validateParams(schemas.idValidation),
    CommentController.delete
  );

// router.route('/projects').get(authenticate, CommentController.projectList)
// router.route('/reset-password').post(validate(schemas.resetPasswordValidation), CommentController.resetPassword)
// router.route('/update-profile-image').post(authenticate, CommentController.updateProfileImage)

module.exports = router;
