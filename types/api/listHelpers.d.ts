import { SQLStatement } from 'sql-template-strings';
import { Query } from 'express-serve-static-core';
import { DbConnectionType } from '../db';
export interface ListRequest {
    limit?: number;
    offset?: number;
    where?: SQLStatement;
}
export interface ListResponse<Item> extends ListRequest {
    items: Item[];
    total: number;
}
export declare type ListItemsGetter<Item> = (conn: DbConnectionType, options: ListRequest) => Promise<Item[]>;
export declare type ListTotalGetter = (conn: DbConnectionType) => Promise<number>;
export declare function getListAsListResponse<Item>(conn: DbConnectionType, options: ListRequest, itemsGetter: ListItemsGetter<Item>, totalGetter: ListTotalGetter): Promise<ListResponse<Item>>;
export declare function listResponseFactory<Item>(itemsGetter: ListItemsGetter<Item>, totalGetter: ListTotalGetter): (conn: DbConnectionType, options: ListRequest) => Promise<ListResponse<Item>>;
export declare function listOptionsFromQuery(query: Query, defaultLimit?: number, defaultOffset?: number): ListRequest;
export declare function addListRequestToQuery(query: SQLStatement, request: ListRequest): SQLStatement;
//# sourceMappingURL=listHelpers.d.ts.map