export class StatusCodeError extends Error {
    constructor() {
        super(...arguments);
        this.statusCode = 500;
    }
}
export class InvalidRequestError extends StatusCodeError {
    constructor() {
        super(...arguments);
        this.statusCode = 400;
    }
}
export class NotFoundError extends StatusCodeError {
    constructor() {
        super(...arguments);
        this.statusCode = 404;
    }
}
//# sourceMappingURL=errors.js.map