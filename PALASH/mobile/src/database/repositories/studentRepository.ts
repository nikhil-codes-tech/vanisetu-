/**
 * PALASH Student & Classroom Evaluation Local Repository
 * Pure local SQLite data access for student roster and offline assessment scoring.
 */

import { getDatabase } from '../db';
import { StudentRecord, StudentEvaluationRecord, EvaluationSummary, RecentEvaluationItem } from '../types/database';

export const studentRepository = {
  /**
   * Retrieves all students enrolled in a school, optionally filtered by class.
   */
  async findBySchoolId(schoolId: number, className?: string): Promise<StudentRecord[]> {
    const db = getDatabase();
    let query = 'SELECT * FROM students WHERE school_id = ?';
    const params: unknown[] = [schoolId];

    if (className) {
      query += ' AND class_name = ?';
      params.push(className);
    }

    query += ' ORDER BY full_name ASC;';
    const res = await db.execute(query, params);
    return res.rows as StudentRecord[];
  },

  /**
   * Retrieves all students across all schools.
   */
  async findAll(): Promise<StudentRecord[]> {
    const db = getDatabase();
    const res = await db.execute('SELECT * FROM students ORDER BY full_name ASC;');
    return res.rows as StudentRecord[];
  },

  /**
   * Retrieves a single student by their ID.
   */
  async findById(id: number): Promise<StudentRecord | null> {
    const db = getDatabase();
    const res = await db.execute('SELECT * FROM students WHERE id = ?;', [id]);
    return (res.rows[0] as StudentRecord) || null;
  },

  /**
   * Retrieves a single student by student code.
   */
  async findByCode(studentCode: string): Promise<StudentRecord | null> {
    const db = getDatabase();
    const res = await db.execute('SELECT * FROM students WHERE student_code = ?;', [studentCode]);
    return (res.rows[0] as StudentRecord) || null;
  },

  /**
   * Saves or updates a student profile in SQLite.
   */
  async save(item: StudentRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO students (
        id, school_id, student_code, full_name, class_name,
        section, mother_tongue, date_of_birth, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        school_id = excluded.school_id,
        student_code = excluded.student_code,
        full_name = excluded.full_name,
        class_name = excluded.class_name,
        section = excluded.section,
        mother_tongue = excluded.mother_tongue,
        date_of_birth = excluded.date_of_birth,
        updated_at = datetime('now');`,
      [
        item.id,
        item.school_id,
        item.student_code,
        item.full_name,
        item.class_name ?? null,
        item.section ?? null,
        item.mother_tongue || 'ho',
        item.date_of_birth ?? null,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Saves multiple student records in a transaction.
   */
  async saveMany(students: StudentRecord[]): Promise<void> {
    const db = getDatabase();
    await db.transaction(async () => {
      for (const student of students) {
        await this.save(student);
      }
    });
  },

  /**
   * Counts students enrolled.
   */
  async count(schoolId?: number): Promise<number> {
    const db = getDatabase();
    let query = 'SELECT COUNT(*) as total FROM students';
    const params: unknown[] = [];
    if (schoolId) {
      query += ' WHERE school_id = ?';
      params.push(schoolId);
    }
    const res = await db.execute(query, params);
    return (res.rows[0] as { total?: number })?.total || 0;
  },

  /**
   * Records or updates a student assessment/worksheet evaluation offline.
   */
  async saveEvaluation(record: StudentEvaluationRecord): Promise<number> {
    const db = getDatabase();
    const res = await db.execute(
      `INSERT INTO student_evaluations (
        student_id, assessment_id, worksheet_id, score, max_score, status, remarks, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')));`,
      [
        record.student_id,
        record.assessment_id ?? null,
        record.worksheet_id ?? null,
        record.score,
        record.max_score || 10.0,
        record.status || 'completed',
        record.remarks ?? null,
        record.created_at ?? null,
      ]
    );
    return res.insertId || 1;
  },

  /**
   * Retrieves all evaluations for a student.
   */
  async getEvaluationsByStudent(studentId: number): Promise<StudentEvaluationRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM student_evaluations WHERE student_id = ? ORDER BY created_at DESC;',
      [studentId]
    );
    return res.rows as StudentEvaluationRecord[];
  },

  /**
   * Retrieves evaluations for a specific assessment.
   */
  async getEvaluationsByAssessment(assessmentId: number): Promise<StudentEvaluationRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM student_evaluations WHERE assessment_id = ? ORDER BY created_at DESC;',
      [assessmentId]
    );
    return res.rows as StudentEvaluationRecord[];
  },

  /**
   * Counts total evaluations conducted, optionally filtered by school.
   */
  async getEvaluationCount(schoolId?: number): Promise<number> {
    const db = getDatabase();
    if (schoolId) {
      const res = await db.execute(
        `SELECT COUNT(*) as total FROM student_evaluations se
         JOIN students s ON s.id = se.student_id
         WHERE s.school_id = ?;`,
        [schoolId]
      );
      return (res.rows[0] as { total?: number })?.total || 0;
    }
    const res = await db.execute('SELECT COUNT(*) as total FROM student_evaluations;');
    return (res.rows[0] as { total?: number })?.total || 0;
  },

  /**
   * Retrieves aggregated evaluation summary (total, completed, average score).
   */
  async getEvaluationSummary(schoolId?: number): Promise<EvaluationSummary> {
    const db = getDatabase();
    let query: string;
    let params: unknown[] = [];

    if (schoolId) {
      query = `SELECT
                 COUNT(*) as total,
                 SUM(CASE WHEN se.status = 'completed' THEN 1 ELSE 0 END) as completed,
                 AVG(se.score) as avg_score
               FROM student_evaluations se
               JOIN students s ON s.id = se.student_id
               WHERE s.school_id = ?;`;
      params = [schoolId];
    } else {
      query = `SELECT
                 COUNT(*) as total,
                 SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                 AVG(score) as avg_score
               FROM student_evaluations;`;
    }

    const res = await db.execute(query, params);
    const row = res.rows[0] as { total?: number; completed?: number; avg_score?: number } | undefined;
    const total = row?.total ? Number(row.total) : 0;
    const completed = row?.completed ? Number(row.completed) : 0;
    const rawAvg = row?.avg_score ? Number(row.avg_score) : 0;

    return {
      total,
      completed,
      averageScore: total > 0 ? Math.round(rawAvg * 10) / 10 : 0,
    };
  },

  /**
   * Retrieves recent student evaluations with student names.
   */
  async getRecentEvaluations(schoolId?: number, limit: number = 5): Promise<RecentEvaluationItem[]> {
    const db = getDatabase();
    let query: string;
    let params: unknown[];

    if (schoolId) {
      query = `SELECT se.*, s.full_name as student_name, s.student_code
               FROM student_evaluations se
               JOIN students s ON s.id = se.student_id
               WHERE s.school_id = ?
               ORDER BY se.id DESC
               LIMIT ?;`;
      params = [schoolId, limit];
    } else {
      query = `SELECT se.*, s.full_name as student_name, s.student_code
               FROM student_evaluations se
               JOIN students s ON s.id = se.student_id
               ORDER BY se.id DESC
               LIMIT ?;`;
      params = [limit];
    }

    const res = await db.execute(query, params);
    return res.rows as RecentEvaluationItem[];
  },
};
