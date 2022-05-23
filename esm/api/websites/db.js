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
import { Website } from './models';
import { addListRequestToQuery } from '../listHelpers';
import { NotFoundError } from '../../errors';
export function retrieveWebsiteByUrl(conn, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield retrieveWebsiteList(conn, {
            where: SQL `WHERE url = ${url}`,
        });
        if (res.length === 0)
            throw new NotFoundError(`no audited website found for url "${url}"`);
        return res[0];
    });
}
export function retrieveWebsiteByAuditId(conn, auditId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield retrieveWebsiteList(conn, {
            where: SQL `WHERE url IN (SELECT url FROM lighthouse_audits w WHERE w.id = ${auditId})`,
        });
        if (res.length === 0)
            throw new NotFoundError(`website found for audit id "${auditId}"`);
        return res[0];
    });
}
export function retrieveWebsiteList(conn, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = SQL `
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
        query = query.append(SQL `\nGROUP BY url`);
        query = query.append(SQL `\nORDER BY time_last_created DESC`);
        query = addListRequestToQuery(query, options);
        const queryResult = yield conn.query(query);
        return queryResult.rows.map(Website.buildForDbRow);
    });
}
export function retrieveWebsiteTotal(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield conn.query(SQL `SELECT COUNT(distinct url) as total_count FROM lighthouse_audits`);
        return +res.rows[0].total_count;
    });
}
//# sourceMappingURL=db.js.map