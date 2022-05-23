import { LHR, LighthouseCategory } from 'lighthouse';
import { AuditRow } from './db';
export interface AuditParams {
    id: string;
    url: string;
    timeCreated: Date;
    timeCompleted?: Date;
    report?: LHR;
}
export interface AuditBody {
    id: string;
    url: string;
    timeCreated: Date;
    timeCompleted?: Date;
    report?: LHR;
    status: AuditStatus;
}
export interface AuditListItem {
    id: string;
    url: string;
    timeCreated: Date;
    timeCompleted?: Date;
    status: AuditStatus;
    categories?: Record<string, LighthouseCategoryAbbr>;
}
export declare enum AuditStatus {
    RUNNING = "RUNNING",
    FAILED = "FAILED",
    COMPLETED = "COMPLETED"
}
declare type LighthouseCategoryAbbr = Pick<LighthouseCategory, 'id' | 'title' | 'score'>;
export declare class Audit {
    id: string;
    url: string;
    timeCreated: Date;
    timeCompleted?: Date | undefined;
    report?: LHR | undefined;
    static build(params: AuditParams): Audit;
    static buildForUrl(url: string): Audit;
    static buildForDbRow(row: AuditRow): Audit;
    constructor(id: string, url: string, timeCreated: Date, timeCompleted?: Date | undefined, report?: LHR | undefined);
    private get logger();
    get status(): AuditStatus;
    get reportJson(): string | undefined;
    get categories(): Record<string, LighthouseCategoryAbbr> | undefined;
    get body(): AuditBody;
    get listItem(): AuditListItem;
    updateWithReport(report: LHR): Audit;
    markCompleted(): Audit;
}
export {};
