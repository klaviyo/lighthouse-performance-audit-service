"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audit = exports.AuditStatus = void 0;
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../../logger"));
var AuditStatus;
(function (AuditStatus) {
    AuditStatus["RUNNING"] = "RUNNING";
    AuditStatus["FAILED"] = "FAILED";
    AuditStatus["COMPLETED"] = "COMPLETED";
})(AuditStatus = exports.AuditStatus || (exports.AuditStatus = {}));
class Audit {
    constructor(id, url, timeCreated, timeCompleted, report) {
        this.id = id;
        this.url = url;
        this.timeCreated = timeCreated;
        this.timeCompleted = timeCompleted;
        this.report = report;
    }
    static build(params) {
        return new Audit(params.id, params.url, params.timeCreated, params.timeCompleted, params.report);
    }
    static buildForUrl(url) {
        const id = (0, uuid_1.v4)();
        const timeCreated = new Date();
        return Audit.build({ id, url, timeCreated });
    }
    static buildForDbRow(row) {
        return Audit.build({
            id: row.id,
            url: row.url,
            timeCreated: row.time_created,
            timeCompleted: row.time_completed || undefined,
            report: row.report_json || undefined,
        });
    }
    get logger() {
        return logger_1.default.child({ auditId: this.id });
    }
    get status() {
        if (this.timeCompleted && this.report)
            return AuditStatus.COMPLETED;
        if (this.timeCompleted && !this.report)
            return AuditStatus.FAILED;
        return AuditStatus.RUNNING;
    }
    get reportJson() {
        if (!this.report)
            return undefined;
        try {
            return JSON.stringify(this.report);
        }
        catch (err) {
            this.logger.info(`report could not be converted to JSON\n${err}`);
            return undefined;
        }
    }
    get categories() {
        if (!this.report)
            return undefined;
        return Object.keys(this.report.categories).reduce((res, key) => (Object.assign(Object.assign({}, res), { [key]: {
                id: this.report.categories[key].id,
                title: this.report.categories[key].title,
                score: this.report.categories[key].score,
            } })), {});
    }
    get body() {
        return {
            id: this.id,
            url: this.url,
            timeCreated: this.timeCreated,
            timeCompleted: this.timeCompleted,
            report: this.report,
            status: this.status,
        };
    }
    get listItem() {
        return {
            id: this.id,
            url: this.url,
            timeCreated: this.timeCreated,
            timeCompleted: this.timeCompleted,
            status: this.status,
            categories: this.categories,
        };
    }
    updateWithReport(report) {
        this.report = report;
        this.markCompleted();
        return this;
    }
    markCompleted() {
        this.timeCompleted = new Date();
        return this;
    }
}
exports.Audit = Audit;
//# sourceMappingURL=models.js.map