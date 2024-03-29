// If in development, set env variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const favicon = require("serve-favicon");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
});
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const {
  localStrategy,
  serializeUserFunction,
  deserializeUserFunction,
} = require("./helpers/passport-config");
const indexRouter = require("./routes/index");
const { setCurrentUser } = require("./helpers/middleware");

// Create app
const app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI;
// Connect to database
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to database");
}

// Define cors options and set
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.options("*", cors(corsOptions));

// Set EJS view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(favicon(path.join(__dirname, "public", "/images/favicon.ico")));
app.use(logger("dev"));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
// Content security policy allow bootstrap CDN
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": [
          "self",
          "http://localhost:3000/",
          "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
          "https://consort.adaptable.app/",
        ],
      },
    },
  })
);
app.use(limiter);

// Use sessions with a secret
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize and use passport for authentication
passport.use("local", localStrategy());
passport.serializeUser(serializeUserFunction);
passport.deserializeUser(deserializeUserFunction);
app.use(passport.initialize());
app.use(passport.session());

// Set middleware and routes
app.use(setCurrentUser);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
