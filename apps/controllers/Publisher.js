const { default: httpStatus } = require("http-status");
const APIError = require("~/errors/ApiError");
const { PublisherService } = require("@/services");
const handleAsync = require("~/utils/handleAsync");
const handleError = require("~/utils/handleError");
const handleResponse = require("~/utils/handleResponse");
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
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Publishers are gotten successfully!"
    );
  }

  async getPublishers(req, res, next) {
    const [response, error] = await handleAsync(
      this.service.query({ "publisher.status": "approved" })
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Publishers are gotten successfully!"
    );
  }

  async createPublisher(req, res, next) {
    const [publisherExist, publisherError] = await handleAsync(
      this.service.findOne({
        "publisher.name": req.body.name,
      })
    );
    if (publisherExist) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ message: "Publisher name is exist" });
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
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.CREATED,
      response,
      "Publisher is created successfully!"
    );
  }

  async updatePublisher(req, res, next) {
    const [publisherExist, publisherError] = await handleAsync(
      this.service.findOne({
        "publisher.name": req.body.name,
      })
    );
    if (publisherExist) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ message: "Publisher already exist" });
    }
    const [response, updateError] = await handleAsync(
      this.service.findOneAndUpdate(
        { "publisher._id": req.params.id },
        {
          $set: {
            "publisher.name": req.body.name,
          },
        }
      )
    );

    const error = publisherError || updateError;
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Publisher is updated successfully!"
    );
  }

  async updatePublisherStatus(req, res, next) {
    const [response, error] = await handleAsync(
      this.service.findOneAndUpdate(
        { "publisher._id": req.params.id },
        {
          $set: {
            "publisher.status": req.body.status, // Nested field'ı güncellemek için dot notation
          },
        }
      )
    );
    if (error) {
      return handleError(error, next);
    }

    handleResponse(
      res,
      httpStatus.OK,
      response,
      "Publishers status is updated successfully!"
    );
  }
}

module.exports = new PublisherController(PublisherService);
