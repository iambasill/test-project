"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const rootRoute_1 = require("./routes/rootRoute");
const errorHandler_1 = require("./utils/errorHandler");
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./utils/logger");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(logger_1.morganMiddleware);
app.use((0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use('/', rootRoute_1.rootRoute);
app.use(errorHandler_1.errorHandler);
app.listen(8000, () => {
    console.log('connected to port 8000');
});
