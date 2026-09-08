/**
 * PALASH Token Storage Abstraction
 * Supports in-memory, SQLite-backed, or native secure storage implementations.
 */

export interface TokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string | null): Promise<void>;
  clear(): Promise<void>;
}

export class MemoryTokenStorage implements TokenStorage {
  private token: string | null = null;

  constructor(initialToken: string | null = null) {
    this.token = initialToken;
  }

  async getToken(): Promise<string | null> {
    return this.token;
  }

  async setToken(token: string | null): Promise<void> {
    this.token = token;
  }

  async clear(): Promise<void> {
    this.token = null;
  }
}

export const defaultTokenStorage: TokenStorage = new MemoryTokenStorage();
