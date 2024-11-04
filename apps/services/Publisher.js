const { default: httpStatus } = require("http-status");
const User = require("@/models/user");
const BaseService = require("~/services/Base");
const APIError = require("~/errors/ApiError");

class PublisherService extends BaseService {
  // constructor() {
  //   // console.log("User :>> ", UserModel);
  // }
}

module.exports = new PublisherService(User);
