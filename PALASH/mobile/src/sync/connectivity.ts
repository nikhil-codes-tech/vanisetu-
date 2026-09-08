/**
 * PALASH Connectivity Detection Service
 * Monitors device online/offline status without blocking local SQLite operations.
 */

export type ConnectivityListener = (isOnline: boolean) => void;

export class ConnectivityService {
  private online: boolean = true;
  private listeners: Set<ConnectivityListener> = new Set();

  constructor(initialOnline: boolean = true) {
    this.online = initialOnline;
  }

  /**
   * Returns current online status immediately.
   */
  isOnline(): boolean {
    return this.online;
  }

  /**
   * Checks if network is reachable.
   * Can perform a fast ping check or return cached state.
   */
  async checkConnectivity(pingUrl?: string): Promise<boolean> {
    if (!pingUrl) {
      return this.online;
    }

    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 3000) : null;

      const res = await fetch(pingUrl, {
        method: 'HEAD',
        signal: controller ? controller.signal : undefined,
      });

      if (timeoutId) clearTimeout(timeoutId);
      const wasOnline = this.online;
      this.online = res.ok || res.status < 500;

      if (wasOnline !== this.online) {
        this.notifyListeners();
      }
      return this.online;
    } catch {
      const wasOnline = this.online;
      this.online = false;
      if (wasOnline !== this.online) {
        this.notifyListeners();
      }
      return false;
    }
  }

  /**
   * Manually sets online state (e.g. from NetInfo event or testing).
   */
  setOnline(isOnline: boolean): void {
    if (this.online !== isOnline) {
      this.online = isOnline;
      this.notifyListeners();
    }
  }

  /**
   * Subscribes to connectivity state changes.
   * Returns an unsubscribe function.
   */
  subscribe(listener: ConnectivityListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.online);
      } catch {
        // Ignore listener errors
      }
    }
  }
}

export const defaultConnectivity = new ConnectivityService(true);
