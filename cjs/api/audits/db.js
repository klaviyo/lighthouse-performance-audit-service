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
exports.deleteAuditById = exports.retrieveAuditById = exports.retrieveAuditCount = exports.retrieveAuditList = exports.persistAudit = void 0;
const sql_template_strings_1 = __importDefault(require("sql-template-strings"));
const errors_1 = require("../../errors");
const models_1 = require("./models");
const listHelpers_1 = require("../listHelpers");
function persistAudit(conn, audit) {
    return __awaiter(this, void 0, void 0, function* () {
        yield conn.query((0, sql_template_strings_1.default) `
    INSERT INTO lighthouse_audits (id, url, time_created, time_completed, report_json)
    VALUES (
      ${audit.id},
      ${audit.url},
      ${audit.timeCreated.toISOString()},
      ${audit.timeCompleted ? audit.timeCompleted.toISOString() : null},
      ${audit.reportJson || null}
    )
    ON CONFLICT (id)
      DO UPDATE SET (url, time_created, time_completed, report_json) = (
        ${audit.url},
        ${audit.timeCreated.toISOString()},
        ${audit.timeCompleted ? audit.timeCompleted.toISOString() : null},
        ${audit.reportJson || null}
      )
      WHERE lighthouse_audits.id = ${audit.id};
  `);
    });
}
exports.persistAudit = persistAudit;
function retrieveAuditList(conn, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = (0, sql_template_strings_1.default) `SELECT * FROM lighthouse_audits`;
        if (options.where) {
            query = query.append((0, sql_template_strings_1.default) `\n`);
            query = query.append(options.where);
        }
        query = query.append((0, sql_template_strings_1.default) `\nORDER BY time_created DESC`);
        query = (0, listHelpers_1.addListRequestToQuery)(query, options);
        const res = yield conn.query(query);
        return res.rows.map(models_1.Audit.buildForDbRow);
    });
}
exports.retrieveAuditList = retrieveAuditList;
function retrieveAuditCount(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield conn.query((0, sql_template_strings_1.default) `SELECT COUNT(*) as total_count FROM lighthouse_audits`);
        return +res.rows[0].total_count;
    });
}
exports.retrieveAuditCount = retrieveAuditCount;
function retrieveAuditById(conn, auditId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield retrieveAuditList(conn, {
            where: (0, sql_template_strings_1.default) `WHERE id = ${auditId}`,
        });
        if (res.length === 0)
            throw new errors_1.NotFoundError(`audit not found for id "${auditId}"`);
        return res[0];
    });
}
exports.retrieveAuditById = retrieveAuditById;
function deleteAuditById(conn, auditId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield conn.query((0, sql_template_strings_1.default) `
    DELETE FROM lighthouse_audits
      WHERE lighthouse_audits.id = ${auditId}
    RETURNING *;
  `);
        if (res.rowCount === 0)
            throw new errors_1.NotFoundError(`audit not found for id "${auditId}"`);
        return models_1.Audit.buildForDbRow(res.rows[0]);
    });
}
exports.deleteAuditById = deleteAuditById;
//# sourceMappingURL=db.js.map