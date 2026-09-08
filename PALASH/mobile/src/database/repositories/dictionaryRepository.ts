/**
 * PALASH Bilingual Dictionary Local Repository
 * Pure local SQLite data access for Ho <-> Hindi bilingual vocabulary.
 */

import { getDatabase } from '../db';
import { DictionaryEntryRecord } from '../types/database';

export const dictionaryRepository = {
  /**
   * Retrieves all active dictionary entries.
   */
  async findAll(limit: number = 200): Promise<DictionaryEntryRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM dictionary_entries 
       WHERE is_active = 1 
       ORDER BY source_word ASC 
       LIMIT ?;`,
      [limit]
    );
    return res.rows as DictionaryEntryRecord[];
  },

  /**
   * Retrieves a single dictionary entry by its ID.
   */
  async findById(id: number): Promise<DictionaryEntryRecord | null> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM dictionary_entries WHERE id = ?;',
      [id]
    );
    return (res.rows[0] as DictionaryEntryRecord) || null;
  },

  /**
   * Retrieves all dictionary entries linked to a specific lesson.
   */
  async findByLessonId(lessonId: number): Promise<DictionaryEntryRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM dictionary_entries 
       WHERE lesson_id = ? AND is_active = 1 
       ORDER BY source_word ASC;`,
      [lessonId]
    );
    return res.rows as DictionaryEntryRecord[];
  },

  /**
   * Searches dictionary words, translations, transliterations, or definitions offline.
   */
  async search(
    queryText: string,
    sourceLang?: string,
    targetLang?: string,
    limit: number = 50
  ): Promise<DictionaryEntryRecord[]> {
    const db = getDatabase();
    const term = `%${queryText.trim()}%`;
    let query = `
      SELECT * FROM dictionary_entries 
      WHERE is_active = 1 
        AND (source_word LIKE ? OR target_word LIKE ? OR transliteration LIKE ? OR definition LIKE ?)
    `;
    const params: unknown[] = [term, term, term, term];

    if (sourceLang) {
      query += ' AND source_language = ?';
      params.push(sourceLang);
    }
    if (targetLang) {
      query += ' AND target_language = ?';
      params.push(targetLang);
    }

    query += ' ORDER BY source_word ASC LIMIT ?;';
    params.push(limit);

    const res = await db.execute(query, params);
    return res.rows as DictionaryEntryRecord[];
  },

  /**
   * Saves or updates a single dictionary entry.
   */
  async save(item: DictionaryEntryRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO dictionary_entries (
        id, source_language, source_word, target_language, target_word,
        transliteration, part_of_speech, pronunciation, definition,
        example_source, example_target, audio_path, lesson_id,
        is_verified, is_active, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        source_language = excluded.source_language,
        source_word = excluded.source_word,
        target_language = excluded.target_language,
        target_word = excluded.target_word,
        transliteration = excluded.transliteration,
        part_of_speech = excluded.part_of_speech,
        pronunciation = excluded.pronunciation,
        definition = excluded.definition,
        example_source = excluded.example_source,
        example_target = excluded.example_target,
        audio_path = excluded.audio_path,
        lesson_id = excluded.lesson_id,
        is_verified = excluded.is_verified,
        is_active = excluded.is_active,
        version = excluded.version,
        updated_at = datetime('now');`,
      [
        item.id,
        item.source_language,
        item.source_word,
        item.target_language,
        item.target_word,
        item.transliteration ?? null,
        item.part_of_speech ?? null,
        item.pronunciation ?? null,
        item.definition ?? null,
        item.example_source ?? null,
        item.example_target ?? null,
        item.audio_path ?? null,
        item.lesson_id ?? null,
        item.is_verified ?? 1,
        item.is_active ?? 1,
        item.version ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Saves multiple dictionary entries efficiently in a transaction.
   */
  async saveMany(entries: DictionaryEntryRecord[]): Promise<void> {
    const db = getDatabase();
    await db.transaction(async () => {
      for (const entry of entries) {
        await this.save(entry);
      }
    });
  },

  /**
   * Counts active entries in the local dictionary.
   */
  async count(): Promise<number> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT COUNT(*) as total FROM dictionary_entries WHERE is_active = 1;'
    );
    return (res.rows[0] as { total?: number })?.total || 0;
  }
};
