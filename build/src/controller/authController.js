"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.registerController = exports.authController = void 0;
const server_1 = require("../server");
const exceptions_1 = require("../httpClass/exceptions");
const authSchema_1 = require("../schema/authSchema");
const secrets_1 = require("../../secrets");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authController = () => {
};
exports.authController = authController;
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = authSchema_1.signUpSchema.parse(req.body);
    const { email, firstName, lastName } = req.body;
    const existingUser = yield server_1.prisma.user.findFirst({
        where: {
            email: validatedData.emailAddress
        }
    });
    if (existingUser && (existingUser.status === 'verified' || existingUser.status === 'blocked')) {
        throw new exceptions_1.BadRequestError('user already exists');
    }
    const user = yield server_1.prisma.user.create({
        data: {
            email,
            firstName,
            lastName
        }
    });
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield server_1.prisma.user.findFirst({
        where: { email }
    });
    if (!user)
        throw new exceptions_1.BadRequestError("Invalid Credentials");
    const valid = yield bcrypt_1.default.compare(password, user.password);
    if (!valid)
        throw new exceptions_1.BadRequestError("Invalid Credentials");
    const token = jsonwebtoken_1.default.sign({ id: user.id }, secrets_1.AUTH_JWT_TOKEN);
    res.status(200).send({
        success: true,
        token: token,
        status: user.status
    });
});
exports.loginController = loginController;
