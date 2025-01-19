var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cron = require("node-cron");
const Promotion = require("./models/promotion.model");

const authRoute = require("./routes/auth.route");
const courseRoute = require("./routes/course.route");
const categoryRoute = require("./routes/category.route");
const promotionRoute = require("./routes/promotion.route");
const dayjs = require("dayjs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/api/users", usersRouter);
app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/promotions", promotionRoute);

app.use(function (req, res, next) {
  next(createError(404));
});

//cron job
cron.schedule("0 0 * * *", () => {
  const date = dayjs().format("DD-MM-YYYY");
  Promotion.updateMany({ endDate: date, isActive: true }, { isActive: false });
  Promotion.updateMany(
    { startDate: date, isActive: false },
    { isActive: true }
  );
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
