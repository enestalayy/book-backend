const { default: httpStatus } = require("http-status");
const handleAsync = require("~/utils/handleAsync");
const handleError = require("~/utils/handleError");
const handleResponse = require("~/utils/handleResponse");

class BaseController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res, next) => {
    const [response, error] = await handleAsync(this.service.insert(req.body));
    if (error) return handleError(error, next);
    handleResponse(res, httpStatus.CREATED, response, "Created successfully!");
  };

  load = async (req, res, next) => {
    const [response, error] = await handleAsync(this.service.load());
    if (error) return handleError(error, next);
    handleResponse(res, httpStatus.OK, response, "Gotten successfully!");
  };

  update = async (req, res, next) => {
    const [response, error] = await handleAsync(
      this.service.update(req.params?.id || req.user?._id, req.body)
    );
    if (error) return handleError(error, next);
    handleResponse(res, httpStatus.OK, response, "Updated successfully!");
  };

  delete = async (req, res, next) => {
    const [response, error] = await handleAsync(
      this.service.removeBy("_id", req.params?.id)
    );
    if (error) return handleError(error, next);
    handleResponse(res, httpStatus.OK, response, "Deleted successfully!");
  };

  find = async (req, res, next) => {
    const [response, error] = await handleAsync(
      this.service.find(req.params?.id)
    );

    if (error) return handleError(error, next);
    handleResponse(res, httpStatus.OK, response, "Found successfully!");
  };
}

module.exports = BaseController;
