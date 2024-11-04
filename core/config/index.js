const { configureApp } = require("./configureApp");
const { mongoDBConnection } = require("./database");

module.exports = (app) => {
  configureApp(app);
  mongoDBConnection();
};
