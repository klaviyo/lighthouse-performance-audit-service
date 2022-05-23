var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import corsMiddleware from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import expressPromiseRouter from 'express-promise-router';
import morgan from 'morgan';
import { Pool } from 'pg';
import logger from '../logger';
import { runDbMigrations, awaitDbConnection } from '../db';
import { bindRoutes as bindAuditRoutes } from '../api/audits/routes';
import { bindRoutes as bindWebsiteRoutes } from '../api/websites/routes';
import { StatusCodeError } from '../errors';
const DEFAULT_PORT = 3003;
function configureMiddleware(app, options) {
    if (options.cors) {
        app.use(corsMiddleware());
    }
    app.use(compression());
    app.use(bodyParser.json());
    app.use(morgan('combined', {
        stream: {
            write(message) {
                logger.info(message);
            },
        },
    }));
}
export function configureErrorMiddleware(app) {
    app.use((err, _req, res, _next) => {
        if (err instanceof StatusCodeError)
            res.status(err.statusCode);
        else
            res.status(500);
        res.send(err.message);
    });
}
function configureRoutes(router, conn) {
    logger.debug('attaching routes...');
    router.get('/_ping', (_req, res) => res.sendStatus(200));
    bindAuditRoutes(router, conn);
    bindWebsiteRoutes(router, conn);
}
export function getApp(options = {}, providedConn) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info('building express app...');
        const conn = providedConn || new Pool(options.postgresConfig);
        yield awaitDbConnection(conn);
        yield runDbMigrations(conn);
        const app = express();
        app.set('connection', conn);
        configureMiddleware(app, options);
        const router = expressPromiseRouter();
        configureRoutes(router, conn);
        app.use(router);
        configureErrorMiddleware(app);
        return app;
    });
}
export function startServer(options = {}, providedConn) {
    return __awaiter(this, void 0, void 0, function* () {
        const { port = DEFAULT_PORT } = options;
        const conn = providedConn || new Pool(options.postgresConfig);
        const app = yield getApp(options, conn);
        logger.debug('starting application server...');
        return yield new Promise((resolve, reject) => {
            const server = app.listen(port, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                logger.info(`listening on port ${port}`);
                resolve(server);
            });
            server.on('close', () => conn.end());
        });
    });
}
//# sourceMappingURL=index.js.map