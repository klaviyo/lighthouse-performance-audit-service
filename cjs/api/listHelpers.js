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
exports.addListRequestToQuery = exports.listOptionsFromQuery = exports.listResponseFactory = exports.getListAsListResponse = void 0;
const sql_template_strings_1 = __importDefault(require("sql-template-strings"));
const errors_1 = require("../errors");
function getListAsListResponse(conn, options, itemsGetter, totalGetter) {
    return __awaiter(this, void 0, void 0, function* () {
        const [items, total] = yield Promise.all([
            itemsGetter(conn, options),
            totalGetter(conn),
        ]);
        const { limit, offset } = options;
        return { items, total, limit, offset };
    });
}
exports.getListAsListResponse = getListAsListResponse;
function listResponseFactory(itemsGetter, totalGetter) {
    return (conn, options) => __awaiter(this, void 0, void 0, function* () { return yield getListAsListResponse(conn, options, itemsGetter, totalGetter); });
}
exports.listResponseFactory = listResponseFactory;
function listOptionsFromQuery(query, defaultLimit = 25, defaultOffset = 0) {
    const { limit: limitStr = defaultLimit, offset: offsetStr = defaultOffset } = query;
    const limit = +limitStr;
    const offset = +offsetStr;
    if (isNaN(limit))
        throw new errors_1.InvalidRequestError(`limit must be a number.`);
    if (isNaN(offset))
        throw new errors_1.InvalidRequestError(`offset must be a number.`);
    return { limit, offset };
}
exports.listOptionsFromQuery = listOptionsFromQuery;
function addListRequestToQuery(query, request) {
    if (typeof request.limit === 'number')
        query.append((0, sql_template_strings_1.default) `\nLIMIT ${request.limit}`);
    if (typeof request.offset === 'number')
        query.append((0, sql_template_strings_1.default) `\nOFFSET ${request.offset}`);
    return query;
}
exports.addListRequestToQuery = addListRequestToQuery;
//# sourceMappingURL=listHelpers.js.map