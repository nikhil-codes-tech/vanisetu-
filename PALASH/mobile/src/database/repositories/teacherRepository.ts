/**
 * PALASH Teacher & School Local Repository
 * Pure local SQLite data access without API/network dependencies.
 */

import { getDatabase } from '../db';
import { TeacherRecord, SchoolRecord } from '../types/database';

export const schoolRepository = {
  /**
   * Retrieves school details by school ID.
   */
  async getSchool(id: number): Promise<SchoolRecord | null> {
    const db = getDatabase();
    const res = await db.execute('SELECT * FROM schools WHERE id = ? LIMIT 1;', [id]);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0] as SchoolRecord;
  },

  /**
   * Saves or updates a school record in SQLite.
   */
  async saveSchool(school: SchoolRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO schools (
        id, school_code, name, district, block, cluster, village, address, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        school_code = excluded.school_code,
        name = excluded.name,
        district = excluded.district,
        block = excluded.block,
        cluster = excluded.cluster,
        village = excluded.village,
        address = excluded.address,
        updated_at = datetime('now');`,
      [
        school.id,
        school.school_code,
        school.name,
        school.district,
        school.block ?? null,
        school.cluster ?? null,
        school.village ?? null,
        school.address ?? null,
        school.created_at ?? null,
        school.updated_at ?? null,
      ]
    );
  },
};

export const teacherRepository = {
  /**
   * Retrieves teacher record by ID, or the first active teacher profile if no ID is passed.
   */
  async getTeacher(id?: number): Promise<TeacherRecord | null> {
    const db = getDatabase();
    let query: string;
    let params: unknown[];

    if (id !== undefined) {
      query = 'SELECT * FROM teachers WHERE id = ? LIMIT 1;';
      params = [id];
    } else {
      query = 'SELECT * FROM teachers ORDER BY id ASC LIMIT 1;';
      params = [];
    }

    const res = await db.execute(query, params);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0] as TeacherRecord;
  },

  /**
   * Saves or updates a teacher record in SQLite.
   */
  async saveTeacher(teacher: TeacherRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO teachers (
        id, user_id, school_id, teacher_code, full_name, phone,
        preferred_language, target_language, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        user_id = excluded.user_id,
        school_id = excluded.school_id,
        teacher_code = excluded.teacher_code,
        full_name = excluded.full_name,
        phone = excluded.phone,
        preferred_language = excluded.preferred_language,
        target_language = excluded.target_language,
        updated_at = datetime('now');`,
      [
        teacher.id,
        teacher.user_id,
        teacher.school_id,
        teacher.teacher_code,
        teacher.full_name,
        teacher.phone ?? null,
        teacher.preferred_language || 'hi',
        teacher.target_language || 'ho',
        teacher.created_at ?? null,
        teacher.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves school details by school ID (convenience alias).
   */
  getSchool: schoolRepository.getSchool,

  /**
   * Saves or updates a school record in SQLite (convenience alias).
   */
  saveSchool: schoolRepository.saveSchool,
};

