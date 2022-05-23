import { AuditListItem, Audit } from '../audits';
import { WebsiteRow } from './db';
export interface WebsiteParams {
    url: string;
    audits: Audit[];
}
export interface WebsiteBody {
    url: string;
    lastAudit: AuditListItem;
    audits: AuditListItem[];
}
export interface WebsiteListItem extends WebsiteBody {
}
export declare class Website {
    url: string;
    audits: Audit[];
    constructor(url: string, audits: Audit[]);
    static build(params: WebsiteParams): Website;
    static buildForDbRow(row: WebsiteRow): Website;
    get lastAudit(): Audit;
    get body(): WebsiteBody;
    get listItem(): WebsiteListItem;
}
