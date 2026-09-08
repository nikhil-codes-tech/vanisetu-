/**
 * PALASH Stage 2.10 Daily Attendance Tests
 * Verifies local offline attendance persistence, roll-call updates, and daily summary statistics.
 */

import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  studentRepository,
  schoolRepository,
  attendanceRepository,
} from '../src/database';

describe('PALASH Stage 2.10 Daily Attendance Tracking', () => {
  let sqlJsInstance: any;
  let SQL: any;

  beforeEach(async () => {
    SQL = await initSqlJs();
    sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);

    // Setup prerequisite school
    await schoolRepository.saveSchool({
      id: 1,
      school_code: 'SCH_TEST_01',
      name: 'Primary School Chaibasa',
      district: 'West Singhbhum',
    });

    // Setup test students
    await studentRepository.saveMany([
      {
        id: 1,
        school_id: 1,
        student_code: 'STU-001',
        full_name: 'Birsa Ho',
        class_name: 'Class 1',
        section: 'A',
        mother_tongue: 'ho',
      },
      {
        id: 2,
        school_id: 1,
        student_code: 'STU-002',
        full_name: 'Soma Munda',
        class_name: 'Class 1',
        section: 'A',
        mother_tongue: 'ho',
      },
      {
        id: 3,
        school_id: 1,
        student_code: 'STU-003',
        full_name: 'Rani Kunkal',
        class_name: 'Class 1',
        section: 'B',
        mother_tongue: 'ho',
      },
    ]);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  test('1. Record and retrieve single student attendance', async () => {
    await attendanceRepository.recordAttendance({
      student_id: 1,
      school_id: 1,
      attendance_date: '2026-09-07',
      status: 'present',
      remarks: 'Arrived on time',
    });

    const record = await attendanceRepository.findByStudentAndDate(1, '2026-09-07');
    expect(record).not.toBeNull();
    expect(record?.status).toBe('present');
    expect(record?.remarks).toBe('Arrived on time');
    expect(record?.school_id).toBe(1);
  });

  test('2. Update attendance status on conflict (upsert idempotency)', async () => {
    // Initial record: late
    await attendanceRepository.recordAttendance({
      student_id: 1,
      school_id: 1,
      attendance_date: '2026-09-07',
      status: 'late',
      remarks: 'Bus delay',
    });

    let record = await attendanceRepository.findByStudentAndDate(1, '2026-09-07');
    expect(record?.status).toBe('late');

    // Updated record: present
    await attendanceRepository.recordAttendance({
      student_id: 1,
      school_id: 1,
      attendance_date: '2026-09-07',
      status: 'present',
      remarks: 'Corrected status',
    });

    record = await attendanceRepository.findByStudentAndDate(1, '2026-09-07');
    expect(record?.status).toBe('present');
    expect(record?.remarks).toBe('Corrected status');

    // Only one record should exist for this student on this date
    const history = await attendanceRepository.findByStudent(1);
    expect(history.length).toBe(1);
  });

  test('3. Bulk record attendance and calculate daily summary', async () => {
    const today = '2026-09-07';
    await attendanceRepository.recordBulkAttendance([
      { student_id: 1, school_id: 1, attendance_date: today, status: 'present' },
      { student_id: 2, school_id: 1, attendance_date: today, status: 'absent', remarks: 'Fever' },
      { student_id: 3, school_id: 1, attendance_date: today, status: 'late' },
    ]);

    const records = await attendanceRepository.findByDate(1, today);
    expect(records.length).toBe(3);

    const summary = await attendanceRepository.getSummaryByDate(1, today);
    expect(summary.total).toBe(3);
    expect(summary.present).toBe(1);
    expect(summary.absent).toBe(1);
    expect(summary.late).toBe(1);
    expect(summary.excused).toBe(0);
  });

  test('4. Retrieve student multi-day attendance history', async () => {
    await attendanceRepository.recordAttendance({
      student_id: 1,
      school_id: 1,
      attendance_date: '2026-09-05',
      status: 'present',
    });
    await attendanceRepository.recordAttendance({
      student_id: 1,
      school_id: 1,
      attendance_date: '2026-09-06',
      status: 'present',
    });
    await attendanceRepository.recordAttendance({
      student_id: 1,
      school_id: 1,
      attendance_date: '2026-09-07',
      status: 'excused',
      remarks: 'Family festival',
    });

    const history = await attendanceRepository.findByStudent(1);
    expect(history.length).toBe(3);
    expect(history[0].attendance_date).toBe('2026-09-07');
    expect(history[0].status).toBe('excused');
  });
});
