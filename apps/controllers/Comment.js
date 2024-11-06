const { default: httpStatus } = require("http-status");
const { CommentService } = require("@/services");
const handleAsync = require("~/utils/handleAsync");
const handleError = require("~/utils/handleError");
const BaseController = require("~/controllers/Base");

class CommentController extends BaseController {
  constructor(service) {
    super(service);
    this.service = service;
    this.createComment = this.createComment.bind(this);
    this.getComments = this.getComments.bind(this);
  }

  // CREATE COMMENT
  async createComment(req, res, next) {
    const [response, error] = await handleAsync(
      this.service.insert({
        user_id: req.user?._id,
        ...req.body,
      })
    );
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      return handleError(error, next);
    }

    res.status(httpStatus.CREATED).send(response);
  }

  // GET COMMENTS
  async getComments(req, res) {
    const [response, error] = await handleAsync(
      this.service.paginate({ book_id: req.params.id }, req.query)
    );
    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
    res.status(httpStatus.OK).send(response);
  }
}

module.exports = new CommentController(CommentService);
