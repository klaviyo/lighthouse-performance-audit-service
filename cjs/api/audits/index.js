"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAudit = exports.getAudits = exports.getAudit = exports.triggerAudit = exports.AuditStatus = exports.Audit = void 0;
var models_1 = require("./models");
Object.defineProperty(exports, "Audit", { enumerable: true, get: function () { return models_1.Audit; } });
Object.defineProperty(exports, "AuditStatus", { enumerable: true, get: function () { return models_1.AuditStatus; } });
var methods_1 = require("./methods");
Object.defineProperty(exports, "triggerAudit", { enumerable: true, get: function () { return methods_1.triggerAudit; } });
Object.defineProperty(exports, "getAudit", { enumerable: true, get: function () { return methods_1.getAudit; } });
Object.defineProperty(exports, "getAudits", { enumerable: true, get: function () { return methods_1.getAudits; } });
Object.defineProperty(exports, "deleteAudit", { enumerable: true, get: function () { return methods_1.deleteAudit; } });
//# sourceMappingURL=index.js.map