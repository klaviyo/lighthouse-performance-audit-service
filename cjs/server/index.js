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
exports.startServer = exports.getApp = exports.configureErrorMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const morgan_1 = __importDefault(require("morgan"));
const pg_1 = require("pg");
const logger_1 = __importDefault(require("../logger"));
const db_1 = require("../db");
const routes_1 = require("../api/audits/routes");
const routes_2 = require("../api/websites/routes");
const errors_1 = require("../errors");
const DEFAULT_PORT = 3003;
function configureMiddleware(app, options) {
    if (options.cors) {
        app.use((0, cors_1.default)());
    }
    app.use((0, compression_1.default)());
    app.use(body_parser_1.default.json());
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write(message) {
                logger_1.default.info(message);
            },
        },
    }));
}
function configureErrorMiddleware(app) {
    app.use((err, _req, res, _next) => {
        if (err instanceof errors_1.StatusCodeError)
            res.status(err.statusCode);
        else
            res.status(500);
        res.send(err.message);
    });
}
exports.configureErrorMiddleware = configureErrorMiddleware;
function configureRoutes(router, conn) {
    logger_1.default.debug('attaching routes...');
    router.get('/_ping', (_req, res) => res.sendStatus(200));
    (0, routes_1.bindRoutes)(router, conn);
    (0, routes_2.bindRoutes)(router, conn);
}
function getApp(options = {}, providedConn) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info('building express app...');
        const conn = providedConn || new pg_1.Pool(options.postgresConfig);
        yield (0, db_1.awaitDbConnection)(conn);
        yield (0, db_1.runDbMigrations)(conn);
        const app = (0, express_1.default)();
        app.set('connection', conn);
        configureMiddleware(app, options);
        const router = (0, express_promise_router_1.default)();
        configureRoutes(router, conn);
        app.use(router);
        configureErrorMiddleware(app);
        return app;
    });
}
exports.getApp = getApp;
function startServer(options = {}, providedConn) {
    return __awaiter(this, void 0, void 0, function* () {
        const { port = DEFAULT_PORT } = options;
        const conn = providedConn || new pg_1.Pool(options.postgresConfig);
        const app = yield getApp(options, conn);
        logger_1.default.debug('starting application server...');
        return yield new Promise((resolve, reject) => {
            const server = app.listen(port, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                logger_1.default.info(`listening on port ${port}`);
                resolve(server);
            });
            server.on('close', () => conn.end());
        });
    });
}
exports.startServer = startServer;
//# sourceMappingURL=index.js.map