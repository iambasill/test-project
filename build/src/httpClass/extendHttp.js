"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http_Exception = void 0;
class http_Exception extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.http_Exception = http_Exception;
