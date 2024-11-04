const { default: httpStatus } = require("http-status");
const APIError = require("~/errors/ApiError");
const { PublisherService } = require("@/services");
const handleAsync = require("~/utils/handleAsync");
const handleError = require("~/utils/handleError");
const BaseController = require("~/controllers/Base");

class PublisherController extends BaseController {
  constructor(service) {
    super(service);
    this.service = service;
    this.createPublisher = this.createPublisher.bind(this);
    this.updatePublisher = this.updatePublisher.bind(this);
    this.updatePublisherStatus = this.updatePublisherStatus.bind(this);
    this.getPublishers = this.getPublishers.bind(this);
    this.getPublishersById = this.getPublishersById.bind(this);
  }

  async getPublishersById(req, res, next) {
    const [response, error] = await handleAsync(
      this.service.findOne({ "publisher._id": req.params.id })
    );
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      return handleError(error, next);
    }
    return res.status(httpStatus.OK).send(response);
  }
  async getPublishers(req, res, next) {
    const [response, error] = await handleAsync(
      this.service.query({ status: "approved" })
    );
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      return handleError(error, next);
    }
    return res.status(httpStatus.OK).send(response);
  }

  async createPublisher(req, res, next) {
    const [publisherExist, publisherError] = await handleAsync(
      this.service.findOne({
        "publisher.name": req.body.name,
      })
    );
    if (publisherExist) {
      res.status(httpStatus.CONFLICT).send(error);
      return handleError(publisherExist, next);
    }
    const [response, updateError] = await handleAsync(
      this.service.update(
        { _id: req.user?._id },
        {
          $set: {
            publisher: req.body,
          },
        }
      )
    );
    const error = updateError || publisherError;
    if (error) {
      console.log("error :>> ", error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      return handleError(error, next);
    }

    res.status(httpStatus.CREATED).send(response);
  }

  async updatePublisher(req, res, next) {
    console.log("req.body.name :>> ", req.body.name);
    try {
      let user = await this.service.findOneAndUpdate(
        { "publisher._id": req.params.publisher_id },
        {
          $set: {
            "publisher.name": req.body.name, // Nested field'ı güncellemek için dot notation
          },
        }
      );
      if (!user)
        return res
          .status(httpStatus.NOT_FOUND)
          .send(new APIError("Publisher is not found", httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(user);
    } catch (e) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e?.message);
      next(e);
    }
  }
  async updatePublisherStatus(req, res, next) {
    console.log("ÇALIŞTIM");
    try {
      let user = await this.service.findOneAndUpdate(
        { "publisher._id": req.params.publisher_id },
        {
          $set: {
            "publisher.status": req.body.status, // Nested field'ı güncellemek için dot notation
          },
        }
      );
      if (!user)
        return res
          .status(httpStatus.NOT_FOUND)
          .send(new APIError("User is not found", httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(user);
    } catch (e) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e?.message);
      next(e);
    }
  }
}

module.exports = new PublisherController(PublisherService);
