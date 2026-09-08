/**
 * PALASH SQLite Database Connection Manager
 * Manages runtime SQLite connections with @op-engineering/op-sqlite on Android
 * and provides WASM sql.js driver fallback for Jest / Node environment.
 */

import { DatabaseDriver, QueryResult } from './types/database';
import { DATABASE_NAME } from './schema';
import { runMigrations } from './migrations';

let activeDriver: DatabaseDriver | null = null;
let isInitialized = false;

/**
 * Driver implementation using @op-engineering/op-sqlite for React Native Android/iOS.
 */
export class OpSqliteDriver implements DatabaseDriver {
  private db: any;

  constructor(dbInstance: any) {
    this.db = dbInstance;
  }

  async execute(query: string, params: unknown[] = []): Promise<QueryResult> {
    const res = await this.db.execute(query, params);
    return {
      rows: res.rows?._array || res.rows || [],
      rowsAffected: res.rowsAffected || 0,
      insertId: res.insertId,
    };
  }

  async executeBatch(queries: { query: string; params?: unknown[] }[]): Promise<void> {
    const batch = queries.map((q) => [q.query, q.params || []] as [string, unknown[]]);
    await this.db.executeBatch(batch);
  }

  async transaction<T>(action: (tx: DatabaseDriver) => Promise<T>): Promise<T> {
    return await this.db.transaction(async (rawTx: any) => {
      const txDriver = new OpSqliteDriver(rawTx);
      return await action(txDriver);
    });
  }

  async close(): Promise<void> {
    if (this.db && typeof this.db.close === 'function') {
      this.db.close();
    }
  }
}

/**
 * Driver implementation using WASM-based sql.js for Node / Jest testing.
 */
export class SqlJsDriver implements DatabaseDriver {
  private db: any;

  constructor(dbInstance: any) {
    this.db = dbInstance;
  }

  async execute(query: string, params: unknown[] = []): Promise<QueryResult> {
    const trimmed = query.trim().toUpperCase();
    const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('WITH');

    if (isSelect) {
      try {
        const stmt = this.db.prepare(query);
        if (params && params.length > 0) {
          stmt.bind(params);
        }
        const rows: any[] = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return {
          rows,
          rowsAffected: 0,
        };
      } catch (err) {
        throw err;
      }
    } else {
      try {
        this.db.run(query, params);
        let rowsAffected = 0;
        let insertId: number | undefined = undefined;

        try {
          const infoRes = this.db.exec('SELECT changes() as changes, last_insert_rowid() as id;');
          if (infoRes.length > 0 && infoRes[0].values.length > 0) {
            rowsAffected = Number(infoRes[0].values[0][0]) || 0;
            insertId = Number(infoRes[0].values[0][1]) || undefined;
          }
        } catch {
          // Ignored if changes() query fails
        }

        return {
          rows: [],
          rowsAffected,
          insertId,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  async executeBatch(queries: { query: string; params?: unknown[] }[]): Promise<void> {
    for (const item of queries) {
      await this.execute(item.query, item.params || []);
    }
  }

  async transaction<T>(action: (tx: DatabaseDriver) => Promise<T>): Promise<T> {
    await this.execute('BEGIN TRANSACTION;');
    try {
      const result = await action(this);
      await this.execute('COMMIT;');
      return result;
    } catch (err) {
      await this.execute('ROLLBACK;');
      throw err;
    }
  }

  async close(): Promise<void> {
    if (this.db && typeof this.db.close === 'function') {
      this.db.close();
    }
  }
}

/**
 * Sets a custom database driver (useful for tests or custom initialization).
 */
export function setDatabaseDriver(driver: DatabaseDriver): void {
  activeDriver = driver;
  isInitialized = false;
}

/**
 * Creates the default SQLite driver.
 * Attempts to load @op-engineering/op-sqlite, with fallback to sql.js if on Node.
 */
async function createDefaultDriver(): Promise<DatabaseDriver> {
  try {
    // Attempt React Native @op-engineering/op-sqlite
    const { open } = require('@op-engineering/op-sqlite');
    const db = open({ name: DATABASE_NAME });
    return new OpSqliteDriver(db);
  } catch (rnErr) {
    try {
      // Fallback for Node / Jest with sql.js (WASM)
      const initSqlJs = require('sql.js');
      const SQL = await initSqlJs();
      const db = new SQL.Database();
      return new SqlJsDriver(db);
    } catch (nodeErr) {
      throw new Error(
        'Could not load SQLite driver: neither @op-engineering/op-sqlite nor sql.js is available.'
      );
    }
  }
}

/**
 * Initializes the SQLite database.
 * 1. Opens/creates database
 * 2. Enables foreign keys (PRAGMA foreign_keys = ON)
 * 3. Runs pending migrations
 * 4. Idempotent — safe to call multiple times
 */
export async function initializeDatabase(customDriver?: DatabaseDriver): Promise<DatabaseDriver> {
  if (customDriver) {
    activeDriver = customDriver;
  } else if (!activeDriver) {
    activeDriver = await createDefaultDriver();
  }

  // Always enable foreign key enforcement
  await activeDriver.execute('PRAGMA foreign_keys = ON;');

  // Run migrations to ensure schema is at latest version
  await runMigrations(activeDriver);

  isInitialized = true;
  return activeDriver;
}

/**
 * Returns the active database driver.
 * Throws an error if initializeDatabase has not been called.
 */
export function getDatabase(): DatabaseDriver {
  if (!activeDriver || !isInitialized) {
    throw new Error('Database is not initialized. Call initializeDatabase() first.');
  }
  return activeDriver;
}

/**
 * Closes the active database connection and resets state.
 */
export async function closeDatabase(): Promise<void> {
  if (activeDriver) {
    await activeDriver.close();
    activeDriver = null;
    isInitialized = false;
  }
}
