const winston = require('winston');
const path = require('path');

// Check for the --verbose flag
const verbose = process.argv.includes('--verbose');

const logger = winston.createLogger({
  level: verbose ? 'debug' : 'info', // More detailed logs if verbose is enabled
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    // Write all logs with level `info` and below to `combined.log`
    // Write all logs with level `debug` and below to `verbose.log` if verbose mode is enabled
    new winston.transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'combined.log'),
    }),
    ...(verbose
      ? [
          new winston.transports.File({
            filename: path.join(__dirname, '..', '..', 'logs', 'verbose.log'),
            level: 'debug',
          }),
        ]
      : []),
  ],
});

// If we're not in production, also log to the console with the colorized simple format.
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
