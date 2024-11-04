const router = require("express").Router();
const validate = require("~/middlewares/validate");
const authenticate = require("~/middlewares/auth");
const schemas = require("@/validations/book");
const BookController = require("@/controllers/Book");

// GET BOOK
router.route("/:id").get(BookController.find);

router.get("/", BookController.load);

// CREATE BOOK
router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    BookController.createBook
  );

// UPDATE BOOK
router
  .route("/:id")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    BookController.update
  );
// router
//   .route("/login")
//   .post(validate(schemas.loginValidation), BookController.login);
// router
//   .route("/change-password")
//   .post(
//     authenticate,
//     validate(schemas.changePasswordValidation),
//     BookController.changePassword
//   );
router.route("/:id").delete(authenticate, BookController.delete);

// router.route('/projects').get(authenticate, BookController.projectList)
// router.route('/reset-password').post(validate(schemas.resetPasswordValidation), BookController.resetPassword)
// router.route('/update-profile-image').post(authenticate, BookController.updateProfileImage)

module.exports = router;
