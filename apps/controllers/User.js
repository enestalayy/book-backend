const { default: httpStatus } = require("http-status");
const APIError = require("~/errors/ApiError");
const { UserService } = require("@/services");
const handleAsync = require("~/utils/handleAsync");
const handleError = require("~/utils/handleError");
const BaseController = require("~/controllers/Base");
const { passwordToHash, verifyPassword } = require("~/utils/auth");

class UserController extends BaseController {
  constructor(service) {
    super(service);
    this.service = service;
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  async signup(req, res, next) {
    req.body.password = await passwordToHash(req.body.password);
    const [response, error] = await handleAsync(this.service.insert(req.body));
    if (error) {
      console.log("error :>> ", error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      return handleError(error, next);
    }

    res.status(httpStatus.CREATED).send(response);
  }

  async login(req, res, next) {
    try {
      let user = await this.service.findOne({ email: req.body.email });
      let verified = await verifyPassword(req.body.password, user.password);
      if (!user || !verified)
        return res
          .status(httpStatus.NOT_FOUND)
          .send(new APIError("User is not found", httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(await this.service.login(user));
    } catch (e) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e?.message);
      next(e);
    }
  }

  async changePassword(req, res) {
    console.log("req :>> ", req);
    req.body.password = await passwordToHash(req.body.password);
    await this.service
      .update({ _id: req.user?._id }, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send(
            new APIError(
              "A problem occurred during the update process",
              httpStatus.INTERNAL_SERVER_ERROR
            )
          )
      );
  }

  async resetPassword(req, res) {}
}

module.exports = new UserController(UserService);
