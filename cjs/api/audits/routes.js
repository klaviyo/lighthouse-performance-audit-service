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
exports.bindRoutes = void 0;
const report_generator_1 = __importDefault(require("lighthouse/report/generator/report-generator"));
const logger_1 = __importDefault(require("../../logger"));
const methods_1 = require("./methods");
const listHelpers_1 = require("../listHelpers");
function bindRoutes(router, conn) {
    logger_1.default.debug('attaching audit api routes...');
    router.post('/v1/audits', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const audit = yield (0, methods_1.triggerAudit)(conn, req.body.url, req.body.options);
        res.status(201).json(audit.body);
    }));
    router.get('/v1/audits', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, methods_1.getAudits)(conn, (0, listHelpers_1.listOptionsFromQuery)(req.query));
        res.json(response);
    }));
    router.get('/v1/audits/:auditId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const audit = yield (0, methods_1.getAudit)(conn, req.params.auditId);
        if (req.header('Accept') === 'application/json') {
            res.json(audit.body);
        }
        else {
            const html = report_generator_1.default.generateReportHtml(audit.report);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        }
    }));
    router.delete('/v1/audits/:auditId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const audit = yield (0, methods_1.deleteAudit)(conn, req.params.auditId);
        res.json(audit.body);
    }));
}
exports.bindRoutes = bindRoutes;
//# sourceMappingURL=routes.js.map