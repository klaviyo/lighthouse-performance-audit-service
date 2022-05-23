/// <reference types="node" />
import { Application } from 'express';
import { Server } from 'http';
import { ConnectionConfig } from 'pg';
import { DbConnectionType } from '../db';
export interface LighthouseAuditServiceOptions {
    port?: number;
    cors?: boolean;
    postgresConfig?: ConnectionConfig;
}
export declare function configureErrorMiddleware(app: Application): void;
export declare function getApp(options?: LighthouseAuditServiceOptions, providedConn?: DbConnectionType): Promise<Application>;
export declare function startServer(options?: LighthouseAuditServiceOptions, providedConn?: DbConnectionType): Promise<Server>;
//# sourceMappingURL=index.d.ts.map