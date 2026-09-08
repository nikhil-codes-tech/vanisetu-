/**
 * PALASH Authentication Service for React Native
 * Coordinates FastAPI user registration, OAuth2 password login, and token session management.
 */

import { ApiClient, defaultApiClient } from './api';
import { TokenStorage, defaultTokenStorage } from './tokenStorage';
import {
  UserRegisterRequest,
  UserLoginRequest,
  TokenResponse,
  UserResponse,
} from './types';

export class AuthService {
  private api: ApiClient;
  private storage: TokenStorage;

  constructor(
    api: ApiClient = defaultApiClient,
    storage: TokenStorage = defaultTokenStorage
  ) {
    this.api = api;
    this.storage = storage;
  }

  /**
   * Initializes auth service, loading any persisted token into the API client.
   */
  async init(): Promise<string | null> {
    const token = await this.storage.getToken();
    if (token) {
      this.api.setToken(token);
    }
    return token;
  }

  /**
   * Registers a new user with FastAPI.
   */
  async register(userData: UserRegisterRequest): Promise<UserResponse> {
    return this.api.post<UserResponse>('/auth/register', userData);
  }

  /**
   * Authenticates user using OAuth2 password flow with application/x-www-form-urlencoded.
   * Stores the JWT access token and configures the API client Authorization header.
   */
  async login(credentials: UserLoginRequest): Promise<TokenResponse> {
    const formPayload: Record<string, string> = {
      username: credentials.username,
      password: credentials.password,
    };

    const tokenResponse = await this.api.postForm<TokenResponse>('/auth/login', formPayload);

    if (tokenResponse && tokenResponse.access_token) {
      await this.storage.setToken(tokenResponse.access_token);
      this.api.setToken(tokenResponse.access_token);
    }

    return tokenResponse;
  }

  /**
   * Fetches the current authenticated user profile from /auth/me.
   */
  async getMe(): Promise<UserResponse> {
    return this.api.get<UserResponse>('/auth/me');
  }

  /**
   * Logs out the user by clearing the stored token and unsetting the API client token.
   */
  async logout(): Promise<void> {
    await this.storage.clear();
    this.api.setToken(null);
  }

  /**
   * Checks whether an active token exists.
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.getToken();
    return !!token;
  }
}

export const defaultAuthService = new AuthService();
