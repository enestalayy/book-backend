const router = require("express").Router();
const validate = require("~/middlewares/validate");
const validateParams = require("~/middlewares/validateParams");
const authenticate = require("~/middlewares/auth");
const schemas = require("@/validations/book");
const BookController = require("@/controllers/Book");

//  GET BOOK FOR HOME PAGE WITH PAGINATION
router.route("/").get(BookController.getPublishedBooks);

//  GET BOOK BY NAME SEARCH WITH PAGINATION
router.route("/search").get(BookController.getBookByName);

// GET BOOKS FOR AUTHOR
router.route("/profile").get(authenticate, BookController.getBooksForAuthor);
// GET PUBLISHED BOOKS FOR AUTHOR
router
  .route("/author/:id")
  .get(
    authenticate,
    validateParams(schemas.idValidation),
    BookController.getPublishedBooksByAuthor
  );

// GET BOOKS FOR PUBLISHERS
router
  .route("/publisher")
  .get(authenticate, BookController.getBooksForPublisher);
// GET PUBLISHED BOOKS FOR PUBLISHERS
router
  .route("/publisher/:id")
  .get(
    authenticate,
    validateParams(schemas.idValidation),
    BookController.getPublishedBooksByPublisher
  );

// GET BOOK
router
  .route("/:id")
  .get(validateParams(schemas.idValidation), BookController.find);

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
    validateParams(schemas.idValidation),
    validate(schemas.updateValidationByAuthor),
    BookController.updateBook
  );
// UPDATE BOOK STATUS
router
  .route("/status/:id")
  .patch(
    authenticate,
    validateParams(schemas.idValidation),
    validate(schemas.updateValidationByPublisher),
    BookController.updateBookStatus
  );
// ADD READER
router
  .route("/reader/:id")
  .patch(
    authenticate,
    validateParams(schemas.idValidation),
    BookController.addReader
  );

router
  .route("/:id")
  .delete(
    authenticate,
    validateParams(schemas.idValidation),
    BookController.deleteBook
  );

// router.route('/projects').get(authenticate, BookController.projectList)
// router.route('/reset-password').post(validate(schemas.resetPasswordValidation), BookController.resetPassword)
// router.route('/update-profile-image').post(authenticate, BookController.updateProfileImage)

module.exports = router;
