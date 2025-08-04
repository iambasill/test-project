"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_RESET_TOKEN = exports.AUTH_JWT_TOKEN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
exports.AUTH_JWT_TOKEN = process.env.AUTH_JWT_TOKEN;
exports.AUTH_RESET_TOKEN = process.env.AUTH_RESET_TOKEN;
