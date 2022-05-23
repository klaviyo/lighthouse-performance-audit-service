import { Website } from './models';
import { DbConnectionType } from '../../db';
import { ListRequest } from '../listHelpers';
export interface WebsiteRow {
    url: string;
    time_last_created: Date;
    audits_json: string[];
}
export declare function retrieveWebsiteByUrl(conn: DbConnectionType, url: string): Promise<Website>;
export declare function retrieveWebsiteByAuditId(conn: DbConnectionType, auditId: string): Promise<Website>;
export declare function retrieveWebsiteList(conn: DbConnectionType, options: ListRequest): Promise<Website[]>;
export declare function retrieveWebsiteTotal(conn: DbConnectionType): Promise<number>;
