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
  const error = new Error("Page is not found");
  error.status = 404;
  next(error);
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

module.exports = app;
