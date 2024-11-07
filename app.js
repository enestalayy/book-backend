require("module-alias/register");
const express = require("express");
const config = require("~/config");
const PORT = process.env.PORT || 8000;
const app = express();
const path = require("path");

config(app);

// --- ROUTES ----
const {
  UserRoutes,
  BookRoutes,
  PublisherRoutes,
  CommentRoutes,
} = require("@/routes");
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/users", UserRoutes);
app.use("/books", BookRoutes);
app.use("/publishers", PublisherRoutes);
app.use("/comments", CommentRoutes);

app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.statusCode = 404;
  next(error);
});

// MAIN ERROR HANDLING
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    code: statusCode,
    status: false,
    result: null,
    message: message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

module.exports = app;
