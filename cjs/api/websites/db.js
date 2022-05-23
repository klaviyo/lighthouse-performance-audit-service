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
exports.retrieveWebsiteTotal = exports.retrieveWebsiteList = exports.retrieveWebsiteByAuditId = exports.retrieveWebsiteByUrl = void 0;
const sql_template_strings_1 = __importDefault(require("sql-template-strings"));
const models_1 = require("./models");
const listHelpers_1 = require("../listHelpers");
const errors_1 = require("../../errors");
function retrieveWebsiteByUrl(conn, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield retrieveWebsiteList(conn, {
            where: (0, sql_template_strings_1.default) `WHERE url = ${url}`,
        });
        if (res.length === 0)
            throw new errors_1.NotFoundError(`no audited website found for url "${url}"`);
        return res[0];
    });
}
exports.retrieveWebsiteByUrl = retrieveWebsiteByUrl;
function retrieveWebsiteByAuditId(conn, auditId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield retrieveWebsiteList(conn, {
            where: (0, sql_template_strings_1.default) `WHERE url IN (SELECT url FROM lighthouse_audits w WHERE w.id = ${auditId})`,
        });
        if (res.length === 0)
            throw new errors_1.NotFoundError(`website found for audit id "${auditId}"`);
        return res[0];
    });
}
exports.retrieveWebsiteByAuditId = retrieveWebsiteByAuditId;
function retrieveWebsiteList(conn, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = (0, sql_template_strings_1.default) `
    SELECT
      distinct url,
      MAX(time_created) as time_last_created,
      array(
        SELECT to_json(n.*)::text
        FROM lighthouse_audits n
        WHERE n.url = o.url
        ORDER BY time_created DESC
      ) as audits_json
    FROM lighthouse_audits o
  `;
        if (options.where) {
            query.append(`\n`);
            query.append(options.where);
        }
        query = query.append((0, sql_template_strings_1.default) `\nGROUP BY url`);
        query = query.append((0, sql_template_strings_1.default) `\nORDER BY time_last_created DESC`);
        query = (0, listHelpers_1.addListRequestToQuery)(query, options);
        const queryResult = yield conn.query(query);
        return queryResult.rows.map(models_1.Website.buildForDbRow);
    });
}
exports.retrieveWebsiteList = retrieveWebsiteList;
function retrieveWebsiteTotal(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield conn.query((0, sql_template_strings_1.default) `SELECT COUNT(distinct url) as total_count FROM lighthouse_audits`);
        return +res.rows[0].total_count;
    });
}
exports.retrieveWebsiteTotal = retrieveWebsiteTotal;
//# sourceMappingURL=db.js.map