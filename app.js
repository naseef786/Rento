var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
const session = require("express-session");
const nocache = require("nocache");
const db = require("./config/server");
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');
const hbs = require("hbs");
const { urlencoded } = require('body-parser');
var app = express();
const handlebars = require('handlebars');
const { Users } = require('./model/user_Schema');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('limit', function(arr, limit) {
  if (!Array.isArray(arr)) { return []; }
  return arr.slice(0, limit);
});

const helpers = require('handlebars-helpers')();


handlebars.registerHelper('equal', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/images/uploads'))

app.use(bodyParser.urlencoded({extended:true}))






app.use(
  session({
    secret: "sessionkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000000 },
  })
);


app.use(nocache());
app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
})
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
