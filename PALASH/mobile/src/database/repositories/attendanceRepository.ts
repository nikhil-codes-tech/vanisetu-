/**
 * PALASH Student Daily Attendance Local Repository
 * Offline-first SQLite persistence for classroom roll-call & attendance tracking.
 */

import { getDatabase } from '../db';
import { StudentAttendanceRecord } from '../types/database';

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export const attendanceRepository = {
  /**
   * Records or updates attendance for a student on a specific date.
   */
  async recordAttendance(record: StudentAttendanceRecord): Promise<number> {
    const db = getDatabase();
    const res = await db.execute(
      `INSERT INTO student_attendance (
        student_id, school_id, attendance_date, status, remarks, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, COALESCE(?, datetime('now')), datetime('now'))
      ON CONFLICT(student_id, attendance_date) DO UPDATE SET
        school_id = excluded.school_id,
        status = excluded.status,
        remarks = excluded.remarks,
        updated_at = datetime('now');`,
      [
        record.student_id,
        record.school_id,
        record.attendance_date,
        record.status,
        record.remarks ?? null,
        record.created_at ?? null,
      ]
    );
    return res.insertId ?? 0;
  },

  /**
   * Records attendance for multiple students in a single transaction.
   */
  async recordBulkAttendance(records: StudentAttendanceRecord[]): Promise<void> {
    const db = getDatabase();
    await db.transaction(async () => {
      for (const record of records) {
        await this.recordAttendance(record);
      }
    });
  },

  /**
   * Retrieves attendance records for a school on a specific date.
   */
  async findByDate(schoolId: number, attendanceDate: string): Promise<StudentAttendanceRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM student_attendance 
       WHERE school_id = ? AND attendance_date = ?
       ORDER BY student_id ASC;`,
      [schoolId, attendanceDate]
    );
    return res.rows as StudentAttendanceRecord[];
  },

  /**
   * Retrieves attendance history for a specific student.
   */
  async findByStudent(studentId: number): Promise<StudentAttendanceRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM student_attendance 
       WHERE student_id = ? 
       ORDER BY attendance_date DESC;`,
      [studentId]
    );
    return res.rows as StudentAttendanceRecord[];
  },

  /**
   * Retrieves a student's attendance record on a given date.
   */
  async findByStudentAndDate(studentId: number, attendanceDate: string): Promise<StudentAttendanceRecord | null> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM student_attendance 
       WHERE student_id = ? AND attendance_date = ?;`,
      [studentId, attendanceDate]
    );
    return (res.rows[0] as StudentAttendanceRecord) || null;
  },

  /**
   * Calculates daily attendance summary statistics for a school.
   */
  async getSummaryByDate(schoolId: number, attendanceDate: string): Promise<AttendanceSummary> {
    const records = await this.findByDate(schoolId, attendanceDate);
    const summary: AttendanceSummary = {
      total: records.length,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };

    for (const r of records) {
      const status = (r.status || '').toLowerCase();
      if (status === 'present') summary.present++;
      else if (status === 'absent') summary.absent++;
      else if (status === 'late') summary.late++;
      else if (status === 'excused') summary.excused++;
    }

    return summary;
  },

  /**
   * Clears all attendance records (primarily used for test teardown).
   */
  async clearAll(): Promise<void> {
    const db = getDatabase();
    await db.execute('DELETE FROM student_attendance;');
  },
};
