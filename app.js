var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('hsbtools:server');
var http = require('http');
const cors = require('cors');

var dotenvConfig = require('dotenv').config()

var app = express();
const publicPath = path.join(__dirname, 'public')

app.locals.publicPath = publicPath;

// -- session stuff --
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); // <--- important!

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'hsbtools',
  // optional settings:
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 1000 * 60 * 60 * 24 * 7 // 1 week
});

app.use(session({
  key: 'hsbtools.sid',
  secret: process.env.SESSION_SECRET || 'replace-with-real-secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set true only when serving over HTTPS in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.user = {
      id: req.session.userId,
      name: req.session.username,
      avatarUrl: req.session.avatarUrl || '/images/default_avatar.png'
    };
  } else {
    res.locals.user = null;
  }
  next();
});

// Call it like this if you need a parameter.
// var apiRouter = require('./src/routes/api')(publicPath);
var apiRouter = require('./src/routes/api')();
var indexRouter = require('./src/routes/index')();
var usersRouter = require('./src/routes/users')();
var listsRouter = require('./src/routes/lists')();
var calculatorsRouter = require('./src/routes/calculators')();
var authRouter = require('./src/routes/auth')();

var port = normalizePort(process.env.PORT || '3000');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', port);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicPath));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/lists', listsRouter);
app.use('/calculators', calculatorsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(
  session({
    key: 'hsbtools.sid',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true if HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  })
);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;