"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogger = void 0;
const winston_1 = __importDefault(require("winston"));
let logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production'
        ? winston_1.default.format.json()
        : winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.simple()),
    defaultMeta: { service: 'lighthouse-audit-service' },
    transports: [
        new winston_1.default.transports.Console({
            silent: process.env.JEST_WORKER_ID !== undefined && !process.env.LOG_LEVEL,
        }),
    ],
});
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }));
    logger.add(new winston_1.default.transports.File({ filename: 'combined.log' }));
}
function setLogger(newLogger) {
    logger = newLogger;
}
exports.setLogger = setLogger;
exports.default = logger;
//# sourceMappingURL=logger.js.map