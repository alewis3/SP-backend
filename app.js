var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docsRouter = require('./routes/docs');
var prefRouter = require('./routes/preferences');
var messagesRouter = require('./routes/messages');

var mongoose = require('mongoose');
//var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect('mongodb://team1:' + encodeURIComponent(process.env.MONGO_PW) + '@localhost:27017/hpc?authSource=admin&w=1', {useNewUrlParser: true, useUnifiedTopology: true },function (error) {
//var connection = mongoose.connect('mongodb://localhost:27017/hpc', {useNewUrlParser: true, useUnifiedTopology: true },function (error) {
    if (error) console.log(error);
    else
      console.log(" **** DB connection successful ****");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../SP-frontend/frontend/build')));
// app.use('/dev', express.static(path.join(__dirname, '/../SP-frontend/frontend/public')));
app.use('/api', express.static(path.join(__dirname, '/apidoc')));

app.use('/api/users', usersRouter);
app.use('/api/docs', docsRouter);
app.use('/api/preferences', prefRouter);
app.use('/api/messages', messagesRouter);
app.use('/', indexRouter);

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
