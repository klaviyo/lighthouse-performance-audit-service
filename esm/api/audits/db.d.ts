import { LHR } from 'lighthouse';
import { DbConnectionType } from '../../db';
import { Audit } from './models';
import { ListRequest } from '../listHelpers';
export interface AuditRow {
    id: string;
    url: string;
    time_created: Date;
    time_completed: Date | null;
    report_json: LHR | null;
}
export declare function persistAudit(conn: DbConnectionType, audit: Audit): Promise<void>;
export declare function retrieveAuditList(conn: DbConnectionType, options?: ListRequest): Promise<Audit[]>;
export declare function retrieveAuditCount(conn: DbConnectionType): Promise<number>;
export declare function retrieveAuditById(conn: DbConnectionType, auditId: string): Promise<Audit>;
export declare function deleteAuditById(conn: DbConnectionType, auditId: string): Promise<Audit>;
