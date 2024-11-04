const { default: httpStatus } = require("http-status");
const APIError = require("~/errors/ApiError");
const { BookService } = require("@/services");
const handleAsync = require("~/utils/handleAsync");
const handleError = require("~/utils/handleError");
const BaseController = require("~/controllers/Base");

class BookController extends BaseController {
  constructor(service) {
    super(service);
    this.service = service;
    this.createBook = this.createBook.bind(this);
    this.getPublishedBooks = this.getPublishedBooks.bind(this);
    this.getPendingBooks = this.getPendingBooks.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  async createBook(req, res, next) {
    console.log("req.user :>> ", req.user);
    const [response, error] = await handleAsync(
      this.service.insert({ author_id: req.user?._id, ...req.body })
    );
    if (error) {
      console.log("error :>> ", error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      return handleError(error, next);
    }

    res.status(httpStatus.CREATED).send(response);
  }

  // Ana sayfa için kitapları getiren servis
  async getPublishedBooks(page = 1, limit = 10) {
    try {
      const books = await Book.find({
        status: "published",
      })
        .populate("author_id", "first_name last_name") // Yazar bilgilerini getir
        .sort({ createdAt: -1 }) // En yeni kitaplar önce
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(); // Performans için lean() kullanıyoruz

      const total = await Book.countDocuments({ status: "published" });

      return {
        books,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error("Kitaplar getirilirken bir hata oluştu");
    }
  }

  // Publisher'lar için bekleyen kitapları getiren servis
  async getPendingBooks(publisherName, page = 1, limit = 10) {
    try {
      const books = await Book.find({
        status: "pending",
        requested_publisher: publisherName,
      })
        .populate("author_id", "first_name last_name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await Book.countDocuments({
        status: "pending",
        requested_publisher: publisherName,
      });

      return {
        books,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error("Bekleyen kitaplar getirilirken bir hata oluştu");
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

module.exports = new BookController(BookService);
