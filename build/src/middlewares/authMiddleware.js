"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../../secrets");
const exceptions_1 = require("../httpClass/exceptions");
const authMiddleware = (req, _res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token || token == null)
        throw new exceptions_1.unAuthorizedError("INVALID TOKEN");
    if (!process.env.AUTH_JWT_TOKEN)
        throw new exceptions_1.unAuthorizedError('JSON WEB TOKEN UNDEFINED!');
    const decoded = jsonwebtoken_1.default.verify(token, secrets_1.AUTH_JWT_TOKEN);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        throw new exceptions_1.unAuthorizedError("INVALID TOKEN PAYLOAD");
    }
    req.body.userID = decoded.id;
    next();
};
exports.authMiddleware = authMiddleware;
