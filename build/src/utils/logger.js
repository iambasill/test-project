"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create logs directory if it doesn't exist
const logDir = 'src/logs';
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
const { combine, timestamp, json, printf, colorize } = winston_1.default.format;
// Custom format for console
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    const log = `${timestamp} ${level}: ${message}`;
    return stack ? `${log}\n${stack}` : log;
});
// Create logger instance
const logger = winston_1.default.createLogger({
    level: 'http', // This is important for Morgan logs
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json(), winston_1.default.format.errors({ stack: true })),
    transports: [
        // Console transport
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), consoleFormat),
        }),
        // Daily rotate file transport for all logs
        new winston_1.default.transports.DailyRotateFile({
            filename: path_1.default.join(logDir, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ],
});
// Morgan middleware
exports.morganMiddleware = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: (message) => logger.http(message.trim()),
    },
});
// Error handling
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
exports.default = logger;
