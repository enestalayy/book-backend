const { default: httpStatus } = require("http-status");
const APIError = require("~/errors/ApiError");
const { BookService } = require("@/services");
const handleAsync = require("~/utils/handleAsync");
const handleError = require("~/utils/handleError");
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
    this.deleteBook = this.deleteBook.bind(this);
  }

  // CREATE BOOK
  async createBook(req, res, next) {
    const user = await User.findById(req.user?._id);
    const [response, error] = await handleAsync(
      this.service.insert({ author_id: req.user?._id, ...req.body })
    );
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      return handleError(error, next);
    }
    if (response) {
      user.writings.push(response._id);
      await user.save();
    }

    res.status(httpStatus.CREATED).send(response);
  }

  // GET PUBLISHED BOOKS
  async getPublishedBooks(req, res) {
    const [response, error] = await handleAsync(
      this.service.paginate({ "publisher.status": "approved" }, req.query)
    );
    if (error) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(new APIError("Book is not found", httpStatus.NOT_FOUND));
    }
    res.status(httpStatus.OK).send(response);
  }

  // GET BOOK BY NAME
  async getBookByName(req, res) {
    console.log("req.query :>> ", req.query);
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
      return res
        .status(httpStatus.NOT_FOUND)
        .send(new APIError("Book is not found", httpStatus.NOT_FOUND));
    }
    res.status(httpStatus.OK).send(response);
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
      return res
        .status(httpStatus.NOT_FOUND)
        .send(new APIError("Book is not found", httpStatus.NOT_FOUND));
    }
    res.status(httpStatus.OK).send(response);
  }
  // GET BOOKS FOR AUTHOR
  async getBooksForAuthor(req, res) {
    const user = await User.findById(req.user?._id);
    if (user.writings.length > 0) {
      const [response, error] = await handleAsync(
        this.service.query({ _id: { $in: user.writings } })
      );
      if (error) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send(new APIError("Book is not found", httpStatus.NOT_FOUND));
      }
      res.status(httpStatus.OK).send(response);
    }
    res.status(httpStatus.NOT_FOUND).send({ message: "Author is not found" });
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
      return res
        .status(httpStatus.NOT_FOUND)
        .send(new APIError("Book is not found", httpStatus.NOT_FOUND));
    }
    res.status(httpStatus.OK).send(response);
  }
  // GET BOOKS FOR PUBLISHER
  async getBooksForPublisher(req, res) {
    console.log("req.user :>> ", req.user);
    if (req.user?.publisher._id) {
      const [response, error] = await handleAsync(
        this.service.query({
          "publisher.publisher_id": req.user?.publisher._id,
        })
      );
      if (error) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send(new APIError("Book is not found", httpStatus.NOT_FOUND));
      }
      return res.status(httpStatus.OK).send(response);
    }
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "Publisher is not found" });
  }

  // UPDATE BOOK
  async updateBook(req, res) {
    const [book, bookError] = await handleAsync(
      this.service.find(req.params.id)
    );
    if (bookError) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(new APIError("Book is not found", httpStatus.NOT_FOUND));
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
      return res
        .status(httpStatus.NOT_FOUND)
        .send(new APIError("Book is not found", httpStatus.NOT_FOUND));
    }

    res.status(httpStatus.OK).send(response);
  }

  // UPDATE BOOK STATUS
  async updateBookStatus(req, res) {
    const [response, error] = await handleAsync(
      this.service.update(req.params.id, {
        "publisher.status": req.body.status,
      })
    );
    if (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(new APIError(error, httpStatus.NOT_FOUND));
    }
    if (!response)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "Book is not found" });

    res.status(httpStatus.OK).send(response);
  }
  async deleteBook(req, res) {
    if (req.user?.writings[req.params.id]) {
      const [userResponse, userError] = await handleAsync(
        User.updateOne(
          { _id: req.params.userId },
          { $pull: { writings: req.params.id } }
        )
      );
      if (userError) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      }
      const [response, error] = await handleAsync(
        this.service.delete(req.params.id)
      );
      if (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      }

      res.status(httpStatus.OK).send({ user: userResponse, book: response });
    }
    res.status(httpStatus.NOT_FOUND).send({ message: "Book is not found" });
  }
}

module.exports = new BookController(BookService);
