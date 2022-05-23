import { WebsiteListItem } from './models';
export { retrieveWebsiteByUrl as getWebsiteByUrl, retrieveWebsiteByAuditId as getWebsiteByAuditId, } from './db';
export declare const getWebsites: (conn: import("../../db").DbConnectionType, options: import("../listHelpers").ListRequest) => Promise<import("../listHelpers").ListResponse<WebsiteListItem>>;
//# sourceMappingURL=methods.d.ts.map