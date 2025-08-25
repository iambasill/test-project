import { http_Exception } from "./extendHttp";


export class BadRequestError extends http_Exception {
    constructor(message: string =("Bad Request"),statusCode: number = 400) {
        super(statusCode, message);
    }
}

export class unAuthorizedError extends http_Exception {
    constructor(message: string=("UnAuthorized"),statusCode: number = 401) {
        super(statusCode, message);
    }
}

export class notFoundError extends http_Exception {
    constructor(message: string=("Not Found"),statusCode: number = 404) {
        super(statusCode, message);
    }
}