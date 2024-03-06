const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./src/routes/user.routes');
const challengeRoutes = require('./src/routes/challenge.routes');
const playerRoutes = require('./src/routes/player.routes');
const gameRoutes = require('./src/routes/game.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const userBoardRoutes = require('./src/routes/userBoard.routes');
const logger = require('./src/utils/logger'); // Assuming this is your custom logger utility

const app = express();

// Log application initialization
logger.info('Initializing application...');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS for all routes
app.use(cors());

// Log middleware setup
logger.info('Setting up middleware...');

// Setup routes
app.use('/challenge', challengeRoutes);
logger.info('Challenge routes configured.');
app.use('/user', userRoutes);
logger.info('User routes configured.');
app.use('/player', playerRoutes);
logger.info('Player routes configured.');
app.use('/game', gameRoutes);
logger.info('Game routes configured.');
app.use('/transactions', transactionRoutes);
logger.info('Transaction routes configured.');
app.use('/userBoard', userBoardRoutes);
logger.info('UserBoard routes configured.');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  logger.info('Handling 404 not found error.');
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  logger.error(`Error handler triggered: ${err.message}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT_APP || 3005;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
