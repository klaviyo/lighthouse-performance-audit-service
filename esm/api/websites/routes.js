var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getWebsites, getWebsiteByUrl, getWebsiteByAuditId } from './methods';
import { listOptionsFromQuery } from '../listHelpers';
export function bindRoutes(router, conn) {
    router.get('/v1/audits/:auditId/website', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield getWebsiteByAuditId(conn, req.params.auditId);
        res.json(response.body);
    }));
    router.get('/v1/websites/:websiteUrl', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield getWebsiteByUrl(conn, req.params.websiteUrl);
        res.json(response.body);
    }));
    router.get('/v1/websites', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield getWebsites(conn, listOptionsFromQuery(req.query));
        res.json(response);
    }));
}
//# sourceMappingURL=routes.js.map