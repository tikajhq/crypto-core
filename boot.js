const os = require("os");
const winston = require('winston');
global.HOSTNAME = os.hostname();
global._ = require("lodash");
// get default config
const defaultConfig = require("./configs/defaults");
//overwrite it
global.CONFIG = _.assign({}, defaultConfig, (require("./configs/" + HOSTNAME)));

/*
 * Create a logger
 */

const logFormat = winston.format.printf(function (info) {
    let date = new Date().toISOString();
    return `${date} [${info.level}]: ${JSON.stringify(info.message, null, 4)}`;
});

global.logger = winston.createLogger({
    level: global.LOG_LEVEL || 'debug',
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
