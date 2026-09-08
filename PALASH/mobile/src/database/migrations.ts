/**
 * PALASH Database Versioning & Migrations Engine
 * Ensures safe, deterministic schema upgrades without destroying local user data.
 */

import { DatabaseDriver } from './types/database';
import { CREATE_TABLES_SQL, CREATE_INDEXES_SQL, CURRENT_DATABASE_VERSION } from './schema';

export interface Migration {
  version: number;
  description: string;
  up: (db: DatabaseDriver) => Promise<void>;
}

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    description: 'Initial schema: schools, teachers, curriculum hierarchy, and worksheets',
    up: async (db: DatabaseDriver) => {
      // 1. Create all base tables
      for (const tableSql of CREATE_TABLES_SQL) {
        await db.execute(tableSql);
      }
      // 2. Create indices
      for (const indexSql of CREATE_INDEXES_SQL) {
        await db.execute(indexSql);
      }
    },
  },
  // Future migrations will be appended here (version 2, 3, etc.)
];

/**
 * Gets the current applied schema version from the database.
 */
export async function getCurrentVersion(db: DatabaseDriver): Promise<number> {
  try {
    // Check if schema_migrations table exists
    const checkTable = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='schema_migrations';"
    );
    if (checkTable.rows.length === 0) {
      return 0;
    }

    const res = await db.execute(
      'SELECT MAX(version) as current_version FROM schema_migrations;'
    );
    if (res.rows.length > 0 && (res.rows[0] as { current_version?: number }).current_version != null) {
      return (res.rows[0] as { current_version: number }).current_version;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Runs all pending migrations in ascending order within transactions.
 */
export async function runMigrations(db: DatabaseDriver): Promise<number> {
  let currentVersion = await getCurrentVersion(db);

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      await db.transaction(async (tx) => {
        await migration.up(tx);
        await tx.execute(
          'INSERT INTO schema_migrations (version, applied_at) VALUES (?, datetime("now"));',
          [migration.version]
        );
        await tx.execute(`PRAGMA user_version = ${migration.version};`);
      });
      currentVersion = migration.version;
    }
  }

  return currentVersion;
}
