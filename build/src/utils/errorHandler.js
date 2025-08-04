"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const extendHttp_1 = require("../httpClass/extendHttp");
const logger_1 = __importDefault(require("./logger"));
const errorHandler = (err, req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production';
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        body: req.body,
        params: req.params,
        query: req.query,
    });
    if (err instanceof extendHttp_1.http_Exception) {
        // Handle known operational errors
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Validation error',
            errors: err.issues.map(error => ({
                field: error.path.join('.'),
                message: error.message
            })),
        });
    }
    // Handle unexpected errors
    return res.status(500).json(Object.assign({ success: false, statusCode: 500, message: isProduction ? 'Internal server error' : err.message }, (!isProduction && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
