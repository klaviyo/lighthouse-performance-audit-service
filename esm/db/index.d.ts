import { Client, Pool } from 'pg';
import { Options } from 'async-retry';
export declare type DbConnectionType = Client | Pool;
export declare function runDbMigrations(conn: DbConnectionType): Promise<void>;
export declare function awaitDbConnection(conn: DbConnectionType, options?: Options): Promise<void>;
