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
exports.awaitDbConnection = exports.runDbMigrations = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const async_retry_1 = __importDefault(require("async-retry"));
const logger_1 = __importDefault(require("../logger"));
function runDbMigrations(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info('running db migrations...');
        const files = fs_1.default.readdirSync(path_1.default.join(__dirname, 'migrations')).sort();
        for (const file of files) {
            logger_1.default.debug(`running migration "${file}"...`);
            const sql = fs_1.default
                .readFileSync(path_1.default.join(__dirname, 'migrations', file))
                .toString();
            yield conn.query(sql);
        }
    });
}
exports.runDbMigrations = runDbMigrations;
function getSchema(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`;
        const queryResult = yield conn.query(sql);
        return queryResult.rows;
    });
}
function awaitDbConnection(conn, options = { maxRetryTime: 10000 }) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.debug('awaiting db connection...');
        yield (0, async_retry_1.default)(() => __awaiter(this, void 0, void 0, function* () {
            yield Promise.race([
                getSchema(conn),
                new Promise((_res, rej) => setTimeout(() => rej('failed to reach the db in 1000ms'), 1000)),
            ]);
        }), options);
    });
}
exports.awaitDbConnection = awaitDbConnection;
//# sourceMappingURL=index.js.map