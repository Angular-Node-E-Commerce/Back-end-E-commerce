const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const path = require("path");
const filpath = path.join(__dirname, "./../logs/");

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new transports.File({ filename: `${filpath}error.log`, level: "error" }),
    new transports.File({ filename: `${filpath}combined.log` }),
  ],
});

module.exports = logger;
