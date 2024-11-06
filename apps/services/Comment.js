const { default: httpStatus } = require("http-status");
const Comment = require("@/models/comment");
const BaseService = require("~/services/Base");
const APIError = require("~/errors/ApiError");

class CommentService extends BaseService {
  // async createBook(userId) {
  //   try {
  //     const user = new BookModel({
  //       user_id: userId,
  //     });
  //     await user.save();
  //     return user;
  //   } catch (e) {
  //     return new APIError(e?.message, httpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}

module.exports = new CommentService(Comment);
