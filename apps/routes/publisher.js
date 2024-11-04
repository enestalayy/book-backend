const router = require("express").Router();
const validate = require("~/middlewares/validate");
const authenticate = require("~/middlewares/auth");
const isAdmin = require("~/middlewares/isAdmin");
const schemas = require("@/validations/Publisher");
const PublisherController = require("@/controllers/Publisher");

// GET Publisher
// Get one Publisher by id
router.route("/:id").get(PublisherController.getPublishersById);
// Get approved Publishers
router.get("/", PublisherController.getPublishers);

// CREATE PUBLISHER
router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    PublisherController.createPublisher
  );

// UPDATE Publisher
router
  .route("/:publisher_id")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    PublisherController.updatePublisher
  );
router
  .route("/status/:publisher_id")
  .patch(
    authenticate,
    isAdmin,
    validate(schemas.updateValidation),
    PublisherController.updatePublisherStatus
  );

router.route("/:id").delete(authenticate, PublisherController.delete);

// router.route('/projects').get(authenticate, PublisherController.projectList)
// router.route('/reset-password').post(validate(schemas.resetPasswordValidation), PublisherController.resetPassword)
// router.route('/update-profile-image').post(authenticate, PublisherController.updateProfileImage)

module.exports = router;
