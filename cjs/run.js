"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const logger_1 = __importDefault(require("./logger"));
(0, _1.startServer)({
    port: process.env.LAS_PORT ? Number(process.env.LAS_PORT) : undefined,
    cors: process.env.LAS_CORS ? Boolean(process.env.LAS_CORS) : undefined,
}).catch(err => {
    logger_1.default.error(err);
    process.exit(1);
});
process.on('SIGINT', () => {
    logger_1.default.info('CTRL+C pressed; exiting.');
    process.exit(0);
});
//# sourceMappingURL=run.js.map