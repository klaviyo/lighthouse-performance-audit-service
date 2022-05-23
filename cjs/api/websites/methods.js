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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebsites = exports.getWebsiteByAuditId = exports.getWebsiteByUrl = void 0;
const db_1 = require("./db");
const listHelpers_1 = require("../listHelpers");
var db_2 = require("./db");
Object.defineProperty(exports, "getWebsiteByUrl", { enumerable: true, get: function () { return db_2.retrieveWebsiteByUrl; } });
Object.defineProperty(exports, "getWebsiteByAuditId", { enumerable: true, get: function () { return db_2.retrieveWebsiteByAuditId; } });
exports.getWebsites = (0, listHelpers_1.listResponseFactory)((...args) => __awaiter(void 0, void 0, void 0, function* () { return (yield (0, db_1.retrieveWebsiteList)(...args)).map(w => w.listItem); }), db_1.retrieveWebsiteTotal);
//# sourceMappingURL=methods.js.map