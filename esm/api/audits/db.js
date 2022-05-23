var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import SQL from 'sql-template-strings';
import { NotFoundError } from '../../errors';
import { Audit } from './models';
import { addListRequestToQuery } from '../listHelpers';
export function persistAudit(conn, audit) {
    return __awaiter(this, void 0, void 0, function* () {
        yield conn.query(SQL `
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
export function retrieveAuditList(conn, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = SQL `SELECT * FROM lighthouse_audits`;
        if (options.where) {
            query = query.append(SQL `\n`);
            query = query.append(options.where);
        }
        query = query.append(SQL `\nORDER BY time_created DESC`);
        query = addListRequestToQuery(query, options);
        const res = yield conn.query(query);
        return res.rows.map(Audit.buildForDbRow);
    });
}
export function retrieveAuditCount(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield conn.query(SQL `SELECT COUNT(*) as total_count FROM lighthouse_audits`);
        return +res.rows[0].total_count;
    });
}
export function retrieveAuditById(conn, auditId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield retrieveAuditList(conn, {
            where: SQL `WHERE id = ${auditId}`,
        });
        if (res.length === 0)
            throw new NotFoundError(`audit not found for id "${auditId}"`);
        return res[0];
    });
}
export function deleteAuditById(conn, auditId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield conn.query(SQL `
    DELETE FROM lighthouse_audits
      WHERE lighthouse_audits.id = ${auditId}
    RETURNING *;
  `);
        if (res.rowCount === 0)
            throw new NotFoundError(`audit not found for id "${auditId}"`);
        return Audit.buildForDbRow(res.rows[0]);
    });
}
//# sourceMappingURL=db.js.map