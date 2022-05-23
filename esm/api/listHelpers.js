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
import { InvalidRequestError } from '../errors';
export function getListAsListResponse(conn, options, itemsGetter, totalGetter) {
    return __awaiter(this, void 0, void 0, function* () {
        const [items, total] = yield Promise.all([
            itemsGetter(conn, options),
            totalGetter(conn),
        ]);
        const { limit, offset } = options;
        return { items, total, limit, offset };
    });
}
export function listResponseFactory(itemsGetter, totalGetter) {
    return (conn, options) => __awaiter(this, void 0, void 0, function* () { return yield getListAsListResponse(conn, options, itemsGetter, totalGetter); });
}
export function listOptionsFromQuery(query, defaultLimit = 25, defaultOffset = 0) {
    const { limit: limitStr = defaultLimit, offset: offsetStr = defaultOffset } = query;
    const limit = +limitStr;
    const offset = +offsetStr;
    if (isNaN(limit))
        throw new InvalidRequestError(`limit must be a number.`);
    if (isNaN(offset))
        throw new InvalidRequestError(`offset must be a number.`);
    return { limit, offset };
}
export function addListRequestToQuery(query, request) {
    if (typeof request.limit === 'number')
        query.append(SQL `\nLIMIT ${request.limit}`);
    if (typeof request.offset === 'number')
        query.append(SQL `\nOFFSET ${request.offset}`);
    return query;
}
//# sourceMappingURL=listHelpers.js.map