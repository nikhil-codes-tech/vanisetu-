/**
 * PALASH Authentication State Store
 * Lightweight, dependency-free observable store for authentication state.
 */

import React, { useState, useEffect } from 'react';
import { defaultAuthService, AuthService } from '../services/authService';
import { UserResponse } from '../services/types';

export interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

type Listener = () => void;

class AuthStore {
  private state: AuthState = {
    user: null,
    token: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  };

  private listeners = new Set<Listener>();
  private service: AuthService;

  constructor(service: AuthService = defaultAuthService) {
    this.service = service;
  }

  setService(service: AuthService): void {
    this.service = service;
  }

  getState(): AuthState {
    return this.state;
  }

  private setState(partial: Partial<AuthState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // Ignore subscriber error
      }
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Restores stored token on application startup.
   */
  async restoreAuth(): Promise<boolean> {
    this.setState({ isLoading: true, error: null });
    try {
      const token = await this.service.init();
      if (token) {
        try {
          const user = await this.service.getMe();
          this.setState({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch {
          // Token expired or invalid
          await this.service.logout();
          this.setState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      } else {
        this.setState({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      this.setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: (err as Error).message,
      });
      return false;
    }
  }

  /**
   * Authenticates user with username and password.
   */
  async login(username: string, password: string): Promise<boolean> {
    this.setState({ isLoading: true, error: null });
    try {
      const tokenRes = await this.service.login({ username, password });
      let user: UserResponse | null = null;
      try {
        user = await this.service.getMe();
      } catch {
        // Fallback user object if /me fails
        user = {
          id: 0,
          username,
          email: null,
          role: 'teacher',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      this.setState({
        token: tokenRes.access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err) {
      const errorMsg = (err as Error).message || 'Invalid username or password';
      this.setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMsg,
      });
      return false;
    }
  }

  /**
   * Logs out user and resets authentication state.
   */
  async logout(): Promise<void> {
    this.setState({ isLoading: true });
    try {
      await this.service.logout();
    } finally {
      this.setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }

  clearError(): void {
    this.setState({ error: null });
  }

  setUser(user: UserResponse): void {
    this.setState({ user });
  }
}

export const authStore = new AuthStore();

/**
 * React hook to subscribe to authentication state.
 */
export function useAuthStore(): AuthState & {
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreAuth: () => Promise<boolean>;
  clearError: () => void;
} {
  const [state, setLocalState] = useState<AuthState>(authStore.getState());

  useEffect(() => {
    return authStore.subscribe(() => {
      setLocalState(authStore.getState());
    });
  }, []);

  return {
    ...state,
    login: (u, p) => authStore.login(u, p),
    logout: () => authStore.logout(),
    restoreAuth: () => authStore.restoreAuth(),
    clearError: () => authStore.clearError(),
  };
}
