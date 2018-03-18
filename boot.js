const winston = require('winston');
global.CONFIG = require("./constants");

/*
 * Create a logger
 */

const logFormat = winston.format.printf(function (info) {
    let date = new Date().toISOString();
    return `${date} [${info.level}]: ${JSON.stringify(info.message, null, 4)}`;
});

global.logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            colorize: true,
            timestamp: true,
        })
    ]
});
