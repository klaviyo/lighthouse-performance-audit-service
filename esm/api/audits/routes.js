var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ReportGenerator from 'lighthouse/report/generator/report-generator';
import logger from '../../logger';
import { triggerAudit, getAudit, getAudits, deleteAudit, } from './methods';
import { listOptionsFromQuery } from '../listHelpers';
export function bindRoutes(router, conn) {
    logger.debug('attaching audit api routes...');
    router.post('/v1/audits', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const audit = yield triggerAudit(conn, req.body.url, req.body.options);
        res.status(201).json(audit.body);
    }));
    router.get('/v1/audits', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield getAudits(conn, listOptionsFromQuery(req.query));
        res.json(response);
    }));
    router.get('/v1/audits/:auditId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const audit = yield getAudit(conn, req.params.auditId);
        if (req.header('Accept') === 'application/json') {
            res.json(audit.body);
        }
        else {
            const html = ReportGenerator.generateReportHtml(audit.report);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        }
    }));
    router.delete('/v1/audits/:auditId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const audit = yield deleteAudit(conn, req.params.auditId);
        res.json(audit.body);
    }));
}
//# sourceMappingURL=routes.js.map