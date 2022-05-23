"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Website = void 0;
const audits_1 = require("../audits");
class Website {
    constructor(url, audits) {
        this.url = url;
        this.audits = audits;
        if (audits.length === 0) {
            throw new Error('Website should not be constructed with no audits! ');
        }
    }
    static build(params) {
        return new Website(params.url, params.audits);
    }
    static buildForDbRow(row) {
        return Website.build({
            url: row.url,
            audits: row.audits_json.map(str => audits_1.Audit.buildForDbRow(JSON.parse(str))),
        });
    }
    get lastAudit() {
        return this.audits[0];
    }
    get body() {
        return {
            url: this.url,
            audits: this.audits.map(a => a.listItem),
            lastAudit: this.lastAudit.listItem,
        };
    }
    get listItem() {
        return this.body;
    }
}
exports.Website = Website;
//# sourceMappingURL=models.js.map