/**
 * PALASH Basic Conflict Handling Strategy
 *
 * Deterministic Strategy:
 * 1. Reference / Master Curriculum (Class, Subject, Learning Outcome, Lesson, Activity, Assessment, School):
 *    - Server Wins: Server is the central administrative authority for curriculum content.
 * 2. Worksheets:
 *    - Version & Timestamp Based:
 *      - If server.version > local.version: Server Wins.
 *      - If server.version == local.version: Compare updated_at (Last-Write-Wins).
 *      - If local record has pending un-uploaded changes in sync_queue, preserve local edit until uploaded.
 * 3. Teacher Profile:
 *    - Last-Write-Wins (LWW) based on ISO updated_at timestamps.
 */

export interface ConflictResolutionResult<T> {
  winner: 'SERVER' | 'LOCAL';
  resolvedRecord: T;
  reason: string;
}

export const conflictHandler = {
  /**
   * Resolves conflicts for worksheet records based on version and timestamps.
   */
  resolveWorksheetConflict<T extends { version?: number; updated_at?: string }>(
    local: T,
    server: T,
    hasPendingLocalChanges: boolean = false
  ): ConflictResolutionResult<T> {
    if (hasPendingLocalChanges) {
      return {
        winner: 'LOCAL',
        resolvedRecord: local,
        reason: 'Local record has pending un-synchronized modifications in the queue.',
      };
    }

    const localVersion = local.version ?? 1;
    const serverVersion = server.version ?? 1;

    if (serverVersion > localVersion) {
      return {
        winner: 'SERVER',
        resolvedRecord: server,
        reason: `Server version (${serverVersion}) is newer than local version (${localVersion}).`,
      };
    }

    if (serverVersion < localVersion) {
      return {
        winner: 'LOCAL',
        resolvedRecord: local,
        reason: `Local version (${localVersion}) is higher than server version (${serverVersion}).`,
      };
    }

    // Same version -> compare timestamps
    const localTime = local.updated_at ? new Date(local.updated_at).getTime() : 0;
    const serverTime = server.updated_at ? new Date(server.updated_at).getTime() : 0;

    if (serverTime >= localTime) {
      return {
        winner: 'SERVER',
        resolvedRecord: server,
        reason: 'Server record timestamp is newer or equal (Last-Write-Wins).',
      };
    } else {
      return {
        winner: 'LOCAL',
        resolvedRecord: local,
        reason: 'Local record timestamp is newer (Last-Write-Wins).',
      };
    }
  },

  /**
   * Resolves conflicts for teacher profiles based on timestamp (Last-Write-Wins).
   */
  resolveProfileConflict<T extends { updated_at?: string }>(
    local: T,
    server: T,
    hasPendingLocalChanges: boolean = false
  ): ConflictResolutionResult<T> {
    if (hasPendingLocalChanges) {
      return {
        winner: 'LOCAL',
        resolvedRecord: local,
        reason: 'Local profile has pending offline updates.',
      };
    }

    const localTime = local.updated_at ? new Date(local.updated_at).getTime() : 0;
    const serverTime = server.updated_at ? new Date(server.updated_at).getTime() : 0;

    if (serverTime >= localTime) {
      return {
        winner: 'SERVER',
        resolvedRecord: server,
        reason: 'Server profile is newer or equal (Last-Write-Wins).',
      };
    }

    return {
      winner: 'LOCAL',
      resolvedRecord: local,
      reason: 'Local profile is newer (Last-Write-Wins).',
    };
  },
};
