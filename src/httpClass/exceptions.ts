import { http_Exception } from "./extendHttp";


export class BadRequestError extends http_Exception {
    constructor(message: string =("BadRequest"),statusCode: number = 400) {
        super(statusCode, message);
    }
}

export class unAuthorizedError extends http_Exception {
    constructor(message: string=("unAuthorized"),statusCode: number = 401) {
        super(statusCode, message);
    }
}