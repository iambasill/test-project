"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRoute = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
exports.rootRoute = (0, express_1.default)();
// rootRoute.use('/')
exports.rootRoute.get('/', authController_1.authController);
