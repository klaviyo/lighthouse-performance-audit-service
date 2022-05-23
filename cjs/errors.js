"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.InvalidRequestError = exports.StatusCodeError = void 0;
class StatusCodeError extends Error {
    constructor() {
        super(...arguments);
        this.statusCode = 500;
    }
}
exports.StatusCodeError = StatusCodeError;
class InvalidRequestError extends StatusCodeError {
    constructor() {
        super(...arguments);
        this.statusCode = 400;
    }
}
exports.InvalidRequestError = InvalidRequestError;
class NotFoundError extends StatusCodeError {
    constructor() {
        super(...arguments);
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=errors.js.map