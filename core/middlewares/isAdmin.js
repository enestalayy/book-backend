const { default: httpStatus } = require("http-status");

const isAdmin = (req, res, next) => {
  if (req.user.email == process.env.ADMIN_EMAIL) {
    return next();
  } else {
    return res.status(httpStatus.UNAUTHORIZED).send({ error: "Unauthorized" });
  }
};

module.exports = isAdmin;
