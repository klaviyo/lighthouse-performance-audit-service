var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import lighthouse from 'lighthouse';
import waitOn from 'wait-on';
import puppeteer from 'puppeteer';
import { Audit } from './models';
import { persistAudit, retrieveAuditList, retrieveAuditCount } from './db';
import parentLogger from '../../logger';
import { InvalidRequestError } from '../../errors';
import { listResponseFactory } from '../listHelpers';
const DEFAULT_UP_TIMEOUT = 30000;
const DEFAULT_CHROME_PORT = 9222;
const DEFAULT_CHROME_PATH = process.env.CHROME_PATH;
const HTTP_RE = /^https?:\/\//;
export { retrieveAuditById as getAudit, deleteAuditById as deleteAudit, } from './db';
export function triggerAudit(conn, url, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url)
            throw new InvalidRequestError('No URL provided. URL is required for auditing.');
        if (!HTTP_RE.test(url))
            throw new InvalidRequestError(`URL "${url}" does not contain a protocol (http or https).`);
        const audit = Audit.buildForUrl(url);
        yield persistAudit(conn, audit);
        if (options.awaitAuditCompleted) {
            yield runAudit(audit, options);
            yield persistAudit(conn, audit);
        }
        else {
            runAudit(audit, options).then(() => persistAudit(conn, audit));
        }
        return audit;
    });
}
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
        const logger = parentLogger.child({ url, auditId: audit.id });
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
            yield waitOn(waitOnOpts);
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
            browser = yield puppeteer.launch(puppeteerOptions);
        }
        catch (err) {
            logger.error(`failed to launch puppeteer browser.\n${err}`);
            audit.markCompleted();
            return audit;
        }
        try {
            logger.debug('Running Lighthouse audit ...');
            const results = yield lighthouse(url, {
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
export const getAudits = listResponseFactory((...args) => __awaiter(void 0, void 0, void 0, function* () { return (yield retrieveAuditList(...args)).map(a => a.listItem); }), retrieveAuditCount);
//# sourceMappingURL=methods.js.map