var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
import retry from 'async-retry';
import logger from '../logger';
export function runDbMigrations(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info('running db migrations...');
        const files = fs.readdirSync(path.join(__dirname, 'migrations')).sort();
        for (const file of files) {
            logger.debug(`running migration "${file}"...`);
            const sql = fs
                .readFileSync(path.join(__dirname, 'migrations', file))
                .toString();
            yield conn.query(sql);
        }
    });
}
function getSchema(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`;
        const queryResult = yield conn.query(sql);
        return queryResult.rows;
    });
}
export function awaitDbConnection(conn, options = { maxRetryTime: 10000 }) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug('awaiting db connection...');
        yield retry(() => __awaiter(this, void 0, void 0, function* () {
            yield Promise.race([
                getSchema(conn),
                new Promise((_res, rej) => setTimeout(() => rej('failed to reach the db in 1000ms'), 1000)),
            ]);
        }), options);
    });
}
//# sourceMappingURL=index.js.map