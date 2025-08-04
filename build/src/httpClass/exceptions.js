"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unAuthorizedError = exports.BadRequestError = void 0;
const extendHttp_1 = require("./extendHttp");
class BadRequestError extends extendHttp_1.http_Exception {
    constructor(message = ("BadRequest"), statusCode = 400) {
        super(statusCode, message);
    }
}
exports.BadRequestError = BadRequestError;
class unAuthorizedError extends extendHttp_1.http_Exception {
    constructor(message = ("unAuthorized"), statusCode = 401) {
        super(statusCode, message);
    }
}
exports.unAuthorizedError = unAuthorizedError;
