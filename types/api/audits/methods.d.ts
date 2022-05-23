import { LighthouseConfig } from 'lighthouse';
import puppeteer from 'puppeteer';
import { Audit, AuditListItem } from './models';
import { DbConnectionType } from '../../db';
export { retrieveAuditById as getAudit, deleteAuditById as deleteAudit, } from './db';
export interface AuditOptions {
    awaitAuditCompleted?: boolean;
    upTimeout?: number;
    chromePort?: number;
    chromePath?: string;
    lighthouseConfig?: LighthouseConfig;
    puppeteerArgs?: puppeteer.PuppeteerNodeLaunchOptions['args'];
}
export declare function triggerAudit(conn: DbConnectionType, url: string, options?: AuditOptions): Promise<Audit>;
export declare const getAudits: (conn: DbConnectionType, options: import("../listHelpers").ListRequest) => Promise<import("../listHelpers").ListResponse<AuditListItem>>;
//# sourceMappingURL=methods.d.ts.map