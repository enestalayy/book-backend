const { default: httpStatus } = require("http-status");
const { BookService } = require("@/services");
const handleAsync = require("~/utils/handleAsync");
const handleError = require("~/utils/handleError");
const handleResponse = require("~/utils/handleResponse");
const BaseController = require("~/controllers/Base");
const User = require("../models/user");
class BookController extends BaseController {
  constructor(service) {
    super(service);
    this.service = service;
    this.createBook = this.createBook.bind(this);
    this.getPublishedBooks = this.getPublishedBooks.bind(this);
    this.getPublishedBooksByAuthor = this.getPublishedBooksByAuthor.bind(this);
    this.getBooksForAuthor = this.getBooksForAuthor.bind(this);
    this.getPublishedBooksByPublisher =
      this.getPublishedBooksByPublisher.bind(this);
    this.getBooksForPublisher = this.getBooksForPublisher.bind(this);
    this.getBookByName = this.getBookByName.bind(this);
    this.updateBook = this.updateBook.bind(this);
    this.updateBookStatus = this.updateBookStatus.bind(this);
    this.addReader = this.addReader.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
  }

  // CREATE BOOK
  async createBook(req, res, next) {
    const user = await User.findById(req.user?._id);
    const [response, error] = await handleAsync(
      this.service.insert({ author_id: req.user?._id, ...req.body })
    );
    if (error) {
      return handleError(error, next);
    }

    user.writings.push(response._id);
    await user.save();

    handleResponse(
      res,
      httpStatus.CREATED,
      response,
      "Book is created successfully!"
    );
  }

  // GET PUBLISHED BOOKS
  async getPublishedBooks(req, res) {
    const [response, error] = await handleAsync(
      this.service.paginate({ "publisher.status": "approved" }, req.query)
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Books are gotten successfully!"
    );
  }

  // GET BOOK BY NAME
  async getBookByName(req, res) {
    const [response, error] = await handleAsync(
      this.service.paginate(
        {
          $and: [
            { name: { $regex: req.query.name || "", $options: "i" } }, // kitap adı araması
            { "publisher.status": "approved" }, // yayıncı durumu kontrolü
          ],
        },
        req.query
      )
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Books are gotten successfully!"
    );
  }

  // GET PUBLISHED BOOKS BY AUTHOR
  async getPublishedBooksByAuthor(req, res) {
    const user = await User.findById(req.params.id);
    const [response, error] = await handleAsync(
      this.service.query({
        $and: [
          { _id: { $in: user.writings } },
          { "publisher.status": "approved" },
        ],
      })
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Books are gotten successfully!"
    );
  }

  // GET BOOKS FOR AUTHOR
  async getBooksForAuthor(req, res) {
    const user = await User.findById(req.user?._id);
    const [response, error] = await handleAsync(
      this.service.query({ _id: { $in: user.writings } })
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Books are gotten successfully!"
    );
  }

  // GET PUBLISHED BOOKS BY PUBLISHER
  async getPublishedBooksByPublisher(req, res) {
    const [response, error] = await handleAsync(
      this.service.query({
        $and: [
          { "publisher.publisher_id": req.params.id },
          { "publisher.status": "approved" },
        ],
      })
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Books are gotten successfully!"
    );
  }

  // GET BOOKS FOR PUBLISHER
  async getBooksForPublisher(req, res) {
    const [response, error] = await handleAsync(
      this.service.query({
        "publisher.publisher_id": req.user?.publisher._id,
      })
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Books are gotten successfully!"
    );
  }

  // UPDATE BOOK
  async updateBook(req, res) {
    const [book, bookError] = await handleAsync(
      this.service.find(req.params.id)
    );
    if (bookError) {
      return handleError(bookError, next);
    }
    const newBookData = {
      ...book._doc,
      ...req.body,
      publish_no: book.publish_no + 1,
      _id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };

    const [response, error] = await handleAsync(
      this.service.insert(newBookData)
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Books are updated successfully!"
    );
  }

  // UPDATE BOOK STATUS
  async updateBookStatus(req, res) {
    const [response, error] = await handleAsync(
      this.service.update(req.params.id, {
        "publisher.status": req.body.status,
      })
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Book is updated successfully!"
    );
  }

  // ADD READER
  async addReader(req, res) {
    const [response, error] = await handleAsync(
      this.service.update(req.params.id, { $push: { readers: req.user._id } })
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Books are updated successfully!"
    );
  }

  // DELETE BOOK
  async deleteBook(req, res) {
    const [userResponse, userError] = await handleAsync(
      User.updateOne(
        { _id: req.params.userId },
        { $pull: { writings: req.params.id } }
      )
    );
    if (userError) {
      return handleError(userError, next);
    }
    const [response, error] = await handleAsync(
      this.service.delete(req.params.id)
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Book is deleted successfully!"
    );
  }
}

module.exports = new BookController(BookService);
