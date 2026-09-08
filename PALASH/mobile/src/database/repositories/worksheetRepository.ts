/**
 * PALASH Worksheet & Questions Local Repository
 * Pure local SQLite data access for Worksheets and Worksheet Questions.
 */

import { getDatabase } from '../db';
import { WorksheetRecord, WorksheetQuestionRecord } from '../types/database';

export const worksheetRepository = {
  /**
   * Retrieves all active worksheets for a given lesson.
   */
  async getWorksheets(lessonId: number): Promise<WorksheetRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM worksheets WHERE lesson_id = ? AND is_active = 1 ORDER BY id ASC;',
      [lessonId]
    );
    return res.rows as WorksheetRecord[];
  },

  /**
   * Alias for getWorksheets to match domain naming.
   */
  async getWorksheetsByLesson(lessonId: number): Promise<WorksheetRecord[]> {
    return worksheetRepository.getWorksheets(lessonId);
  },

  /**
   * Retrieves a single worksheet by ID.
   */
  async getWorksheetById(worksheetId: number): Promise<WorksheetRecord | null> {
    const db = getDatabase();
    const res = await db.execute('SELECT * FROM worksheets WHERE id = ? LIMIT 1;', [worksheetId]);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0] as WorksheetRecord;
  },

  /**
   * Alias for getWorksheetById.
   */
  async getWorksheet(worksheetId: number): Promise<WorksheetRecord | null> {
    return worksheetRepository.getWorksheetById(worksheetId);
  },

  /**
   * Saves or updates a worksheet record in SQLite.
   */
  async saveWorksheet(item: WorksheetRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO worksheets (
        id, lesson_id, title, description, language_code, source_language,
        worksheet_type, difficulty_level, instructions, content, answer_key,
        file_path, version, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        lesson_id = excluded.lesson_id,
        title = excluded.title,
        description = excluded.description,
        language_code = excluded.language_code,
        source_language = excluded.source_language,
        worksheet_type = excluded.worksheet_type,
        difficulty_level = excluded.difficulty_level,
        instructions = excluded.instructions,
        content = excluded.content,
        answer_key = excluded.answer_key,
        file_path = excluded.file_path,
        version = excluded.version,
        is_active = excluded.is_active,
        updated_at = datetime('now');`,
      [
        item.id,
        item.lesson_id,
        item.title,
        item.description ?? null,
        item.language_code || 'hi',
        item.source_language || 'hi',
        item.worksheet_type,
        item.difficulty_level ?? 'beginner',
        item.instructions ?? null,
        item.content ?? null,
        item.answer_key ?? null,
        item.file_path ?? null,
        item.version ?? 1,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves all questions for a given worksheet ordered by question number.
   */
  async getWorksheetQuestions(worksheetId: number): Promise<WorksheetQuestionRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM worksheet_questions WHERE worksheet_id = ? ORDER BY question_number ASC;',
      [worksheetId]
    );
    return res.rows as WorksheetQuestionRecord[];
  },

  /**
   * Alias for getWorksheetQuestions to match domain naming.
   */
  async getQuestionsByWorksheet(worksheetId: number): Promise<WorksheetQuestionRecord[]> {
    return worksheetRepository.getWorksheetQuestions(worksheetId);
  },

  /**
   * Saves or updates a single worksheet question in SQLite.
   */
  async saveWorksheetQuestion(question: WorksheetQuestionRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO worksheet_questions (
        id, worksheet_id, question_number, question_text, question_type,
        options, correct_answer, explanation, marks, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        worksheet_id = excluded.worksheet_id,
        question_number = excluded.question_number,
        question_text = excluded.question_text,
        question_type = excluded.question_type,
        options = excluded.options,
        correct_answer = excluded.correct_answer,
        explanation = excluded.explanation,
        marks = excluded.marks,
        updated_at = datetime('now');`,
      [
        question.id,
        question.worksheet_id,
        question.question_number,
        question.question_text,
        question.question_type,
        question.options ?? null,
        question.correct_answer ?? null,
        question.explanation ?? null,
        question.marks ?? 1,
        question.created_at ?? null,
        question.updated_at ?? null,
      ]
    );
  },

  /**
   * Alias for saveWorksheetQuestion.
   */
  async saveQuestion(question: WorksheetQuestionRecord): Promise<void> {
    return worksheetRepository.saveWorksheetQuestion(question);
  },

  /**
   * Saves multiple worksheet questions in a single transaction.
   */
  async saveWorksheetQuestions(questions: WorksheetQuestionRecord[]): Promise<void> {
    const db = getDatabase();
    await db.transaction(async () => {
      for (const q of questions) {
        await this.saveWorksheetQuestion(q);
      }
    });
  },

  /**
   * Counts total active worksheets in SQLite.
   */
  async countWorksheets(): Promise<number> {
    const db = getDatabase();
    const res = await db.execute('SELECT COUNT(*) as total FROM worksheets WHERE is_active = 1;');
    return (res.rows[0] as { total?: number })?.total || 0;
  },

  /**
   * Counts total worksheet questions in SQLite.
   */
  async countQuestions(): Promise<number> {
    const db = getDatabase();
    const res = await db.execute('SELECT COUNT(*) as total FROM worksheet_questions;');
    return (res.rows[0] as { total?: number })?.total || 0;
  },
};

/**
 * Granular repository for Worksheet Questions
 */
export const worksheetQuestionRepository = {
  getQuestionsByWorksheet: worksheetRepository.getQuestionsByWorksheet,
  getWorksheetQuestions: worksheetRepository.getWorksheetQuestions,
  saveQuestion: worksheetRepository.saveQuestion,
  saveWorksheetQuestion: worksheetRepository.saveWorksheetQuestion,
  saveWorksheetQuestions: worksheetRepository.saveWorksheetQuestions,
};

