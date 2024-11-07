const handleResponse = (res, code, data, message) => {
  return res.status(code).json({
    code,
    status: true,
    result: {
      data: data,
    },
    message,
  });
};

module.exports = handleResponse;
