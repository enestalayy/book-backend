const router = require("express").Router();
const validate = require("~/middlewares/validate");
const validateParams = require("~/middlewares/validateParams");

const authenticate = require("~/middlewares/auth");
const schemas = require("@/validations/user");
const UserController = require("@/controllers/User");

router
  .route("/:id")
  .get(validateParams(schemas.idValidation), UserController.find);

router
  .route("/:id")
  .patch(
    validateParams(schemas.idValidation),
    validate(schemas.updateValidation),
    UserController.update
  );

router.get("/", UserController.load);

router
  .route("/")
  .post(validate(schemas.createValidation), UserController.signup);

router
  .route("/")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    UserController.update
  );
router
  .route("/login")
  .post(validate(schemas.loginValidation), UserController.login);
router
  .route("/change-password")
  .post(
    authenticate,
    validate(schemas.changePasswordValidation),
    UserController.changePassword
  );
router
  .route("/:id")
  .delete(
    authenticate,
    validateParams(schemas.idValidation),
    UserController.delete
  );

module.exports = router;
