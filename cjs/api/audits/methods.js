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
exports.getAudits = exports.triggerAudit = exports.deleteAudit = exports.getAudit = void 0;
const lighthouse_1 = __importDefault(require("lighthouse"));
const wait_on_1 = __importDefault(require("wait-on"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const models_1 = require("./models");
const db_1 = require("./db");
const logger_1 = __importDefault(require("../../logger"));
const errors_1 = require("../../errors");
const listHelpers_1 = require("../listHelpers");
const DEFAULT_UP_TIMEOUT = 30000;
const DEFAULT_CHROME_PORT = 9222;
const DEFAULT_CHROME_PATH = process.env.CHROME_PATH;
const HTTP_RE = /^https?:\/\//;
var db_2 = require("./db");
Object.defineProperty(exports, "getAudit", { enumerable: true, get: function () { return db_2.retrieveAuditById; } });
Object.defineProperty(exports, "deleteAudit", { enumerable: true, get: function () { return db_2.deleteAuditById; } });
function triggerAudit(conn, url, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url)
            throw new errors_1.InvalidRequestError('No URL provided. URL is required for auditing.');
        if (!HTTP_RE.test(url))
            throw new errors_1.InvalidRequestError(`URL "${url}" does not contain a protocol (http or https).`);
        const audit = models_1.Audit.buildForUrl(url);
        yield (0, db_1.persistAudit)(conn, audit);
        if (options.awaitAuditCompleted) {
            yield runAudit(audit, options);
            yield (0, db_1.persistAudit)(conn, audit);
        }
        else {
            runAudit(audit, options).then(() => (0, db_1.persistAudit)(conn, audit));
        }
        return audit;
    });
}
exports.triggerAudit = triggerAudit;
function includesPartial(list, partialString) {
    for (const str of list) {
        if (str.indexOf(partialString) >= 0) {
            return true;
        }
    }
    return false;
}
function runAudit(audit, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = audit.url;
        const { upTimeout = DEFAULT_UP_TIMEOUT, chromePort = DEFAULT_CHROME_PORT, chromePath = DEFAULT_CHROME_PATH, lighthouseConfig = {}, puppeteerArgs = [], } = options;
        const logger = logger_1.default.child({ url, auditId: audit.id });
        logger.info(`Starting Lighthouse audit`);
        try {
            logger.debug('Waiting for URL to be UP ...');
            const u = new URL(url);
            const protocol = u.protocol.substring(0, u.protocol.length - 1);
            const urlToWaitOn = `${protocol}-get://${u.host}${u.pathname}${u.search}`;
            const waitOnOpts = {
                resources: [urlToWaitOn],
                timeout: upTimeout,
                auth: u.username
                    ? { username: u.username, password: u.password }
                    : undefined,
            };
            yield (0, wait_on_1.default)(waitOnOpts);
        }
        catch (err) {
            logger.error(`failed when waiting on the url to become available\n${err}`);
            audit.markCompleted();
            return audit;
        }
        let browser;
        try {
            logger.debug('Launching Chrome with Puppeteer ...');
            if (!includesPartial(puppeteerArgs, '--remote-debugging-port')) {
                puppeteerArgs.push(`--remote-debugging-port=${chromePort}`);
            }
            if (!includesPartial(puppeteerArgs, '--no-sandbox')) {
                puppeteerArgs.push('--no-sandbox');
            }
            const puppeteerOptions = {
                args: puppeteerArgs,
            };
            if (chromePath) {
                puppeteerOptions.executablePath = chromePath;
            }
            browser = yield puppeteer_1.default.launch(puppeteerOptions);
        }
        catch (err) {
            logger.error(`failed to launch puppeteer browser.\n${err}`);
            audit.markCompleted();
            return audit;
        }
        try {
            logger.debug('Running Lighthouse audit ...');
            const results = yield (0, lighthouse_1.default)(url, {
                port: chromePort,
                disableStorageReset: true,
            }, Object.assign({ extends: 'lighthouse:default' }, lighthouseConfig));
            const { lhr } = results;
            if (!lhr) {
                throw new Error('Lighthouse audit did not return a valid report.');
            }
            logger.info('Lighthouse audit run finished successfully.');
            audit.updateWithReport(lhr);
        }
        catch (err) {
            logger.error(`failed while running lighthouse audit.\n${err}`);
            audit.markCompleted();
        }
        finally {
            browser.close();
        }
        return audit;
    });
}
exports.getAudits = (0, listHelpers_1.listResponseFactory)((...args) => __awaiter(void 0, void 0, void 0, function* () { return (yield (0, db_1.retrieveAuditList)(...args)).map(a => a.listItem); }), db_1.retrieveAuditCount);
//# sourceMappingURL=methods.js.map