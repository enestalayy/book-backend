const { default: httpStatus } = require("http-status");
const Book = require("@/models/book");
const BaseService = require("~/services/Base");
const APIError = require("~/errors/ApiError");
const { generateAccessToken, generateRefreshToken } = require("~/utils/auth");
const BookModel = require("../models/book");

class BookService extends BaseService {
  async login(book) {
    try {
      book = {
        ...book.toObject(),
        tokens: {
          access_token: generateAccessToken(book),
          refresh_token: generateRefreshToken(book),
        },
      };
      delete book.password;
      return book;
    } catch (e) {
      return new APIError(e?.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createBook(userId) {
    try {
      const user = new BookModel({
        user_id: userId,
      });
      await user.save();
      return user;
    } catch (e) {
      return new APIError(e?.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new BookService(Book);
