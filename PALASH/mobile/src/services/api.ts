/**
 * PALASH API Client for React Native
 * Communicates with FastAPI backend with token authentication and form-urlencoded support.
 */

import { TokenStorage, defaultTokenStorage } from './tokenStorage';

export interface ApiClientConfig {
  baseUrl?: string;
  timeoutMs?: number;
  tokenStorage?: TokenStorage;
}

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  postForm<T>(path: string, formData: Record<string, string>): Promise<T>;
  put<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
  setToken(token: string | null): void;
  getToken(): string | null;
  getBaseUrl(): string;
}

export class FetchApiClient implements ApiClient {
  private baseUrl: string;
  private timeoutMs: number;
  private token: string | null = null;
  private tokenStorage: TokenStorage;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = (config.baseUrl || 'http://127.0.0.1:8001/api/v1').replace(/\/$/, '');
    this.timeoutMs = config.timeoutMs || 10000;
    this.tokenStorage = config.tokenStorage || defaultTokenStorage;
  }

  setToken(token: string | null): void {
    this.token = token;
    this.tokenStorage.setToken(token).catch(() => {
      // Ignore storage async rejection
    });
  }

  getToken(): string | null {
    return this.token;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    contentType: 'application/json' | 'application/x-www-form-urlencoded' = 'application/json'
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    let requestBody: string | undefined;

    if (body !== undefined) {
      if (contentType === 'application/x-www-form-urlencoded') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (typeof body === 'string') {
          requestBody = body;
        } else if (body instanceof URLSearchParams) {
          requestBody = body.toString();
        } else if (typeof body === 'object' && body !== null) {
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(body as Record<string, string>)) {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          }
          requestBody = params.toString();
        }
      } else {
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(body);
      }
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), this.timeoutMs) : null;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        signal: controller ? controller.signal : undefined,
      });

      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch {
          // Ignore
        }
        throw new Error(`API error ${response.status} (${response.statusText}): ${errorBody}`);
      }

      if (response.status === 204) {
        return null as unknown as T;
      }

      return (await response.json()) as T;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body, 'application/json');
  }

  async postForm<T>(path: string, formData: Record<string, string>): Promise<T> {
    return this.request<T>('POST', path, formData, 'application/x-www-form-urlencoded');
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body, 'application/json');
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

export const defaultApiClient: ApiClient = new FetchApiClient();
