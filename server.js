const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const routes = require("./routing");
const db = require("./models");
const app = express();
const port = process.env.PORT || 8080;
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
} else {
  app.use(express.static("frontend/public"));
}
app.use(routes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    type: "error",
    message: err.message,
  });
});
app.get("*", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"));
  } else {
    res.sendFile(path.resolve(__dirname, "./frontend/public/index.html"));
  }
});
db.sequelize.sync().then(function () {
  app.listen(port, () => console.log(`listening on port ${port}`));
});

// {
//   force: true;
// }
