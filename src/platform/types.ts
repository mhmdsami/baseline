import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type * as schema from "@/db/schema";

/**
 * The database handle the application is allowed to know about. Adapters return
 * whatever concrete driver they use; the shape is drizzle over SQLite semantics.
 */
export type Database = BaseSQLiteDatabase<"async", unknown, typeof schema>;

/**
 * Environment the application needs. Adapters are responsible for reading it
 * from whatever mechanism their platform provides.
 */
export interface Env {
  siteUrl: string;
  authSecret: string;
  googleClientId?: string;
  googleClientSecret?: string;
}

/**
 * The port. Application code imports this and nothing provider-specific.
 * Migrations and deploy are adapter concerns and live in each adapter's scripts,
 * because they are not things the running application does.
 */
export interface Platform {
  readonly name: string;
  env(): Env;
  db(): Database;
}
