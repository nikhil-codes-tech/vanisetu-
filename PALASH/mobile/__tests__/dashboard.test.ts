/**
 * PALASH Stage 2.11 Teacher Dashboard & Progress Tracking Tests
 * Verifies local offline metric aggregation, attendance percentages,
 * assessment summaries, curriculum readiness, school data scoping,
 * and safe empty-state calculations.
 */

import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  teacherRepository,
  schoolRepository,
  curriculumRepository,
  worksheetRepository,
  studentRepository,
  attendanceRepository,
} from '../src/database';

describe('PALASH Stage 2.11 Teacher Dashboard & Progress Tracking', () => {
  let sqlJsInstance: any;
  let SQL: any;

  beforeEach(async () => {
    SQL = await initSqlJs();
    sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);

    // 1. Setup School 1 & 2
    await schoolRepository.saveSchool({
      id: 1,
      school_code: 'SCH-CHAIBASA-01',
      name: 'Chaibasa Tribal Primary School',
      district: 'West Singhbhum',
    });

    await schoolRepository.saveSchool({
      id: 2,
      school_code: 'SCH-RANCHI-02',
      name: 'Ranchi Model School',
      district: 'Ranchi',
    });

    // 2. Setup Teacher for School 1
    await teacherRepository.saveTeacher({
      id: 1,
      user_id: 10,
      school_id: 1,
      teacher_code: 'TCH-001',
      full_name: 'Birsa Ho',
      preferred_language: 'hi',
      target_language: 'ho',
    });

    // 3. Setup Students for School 1
    await studentRepository.saveMany([
      {
        id: 101,
        school_id: 1,
        student_code: 'STU-101',
        full_name: 'Soma Munda',
        class_name: 'Class 1',
        section: 'A',
        mother_tongue: 'ho',
      },
      {
        id: 102,
        school_id: 1,
        student_code: 'STU-102',
        full_name: 'Jolen Kui',
        class_name: 'Class 1',
        section: 'A',
        mother_tongue: 'ho',
      },
      {
        id: 103,
        school_id: 1,
        student_code: 'STU-103',
        full_name: 'Rani Kunkal',
        class_name: 'Class 1',
        section: 'B',
        mother_tongue: 'ho',
      },
      {
        id: 104,
        school_id: 1,
        student_code: 'STU-104',
        full_name: 'Mangal Ho',
        class_name: 'Class 2',
        section: 'A',
        mother_tongue: 'ho',
      },
      // Student in School 2 (should be excluded from School 1 dashboard)
      {
        id: 201,
        school_id: 2,
        student_code: 'STU-201',
        full_name: 'Ranchi Student',
        class_name: 'Class 1',
        mother_tongue: 'mundari',
      },
    ]);

    // 4. Setup Curriculum (Classes, Subjects, Lessons)
    await curriculumRepository.saveClass({
      id: 1,
      name: 'Class 1',
      grade: 1,
      is_active: 1,
    });
    await curriculumRepository.saveClass({
      id: 2,
      name: 'Class 2',
      grade: 2,
      is_active: 1,
    });

    await curriculumRepository.saveSubject({
      id: 11,
      class_id: 1,
      name: 'Ho Mother Tongue',
      code: 'HO-C1',
      is_active: 1,
    });
    await curriculumRepository.saveSubject({
      id: 12,
      class_id: 1,
      name: 'Basic Mathematics',
      code: 'MATH-C1',
      is_active: 1,
    });

    await curriculumRepository.saveLearningOutcome({
      id: 21,
      subject_id: 11,
      code: 'LO-1.1',
      title: 'Greetings & Introductions',
      is_active: 1,
    });

    await curriculumRepository.saveLesson({
      id: 31,
      learning_outcome_id: 21,
      title: 'Johar - Traditional Greetings',
      lesson_number: 1,
      source_language: 'hi',
      is_active: 1,
    });
    await curriculumRepository.saveLesson({
      id: 32,
      learning_outcome_id: 21,
      title: 'Family & Kinship Words',
      lesson_number: 2,
      source_language: 'hi',
      is_active: 1,
    });

    // 5. Setup Worksheets
    await worksheetRepository.saveWorksheet({
      id: 41,
      lesson_id: 31,
      title: 'Johar Matching Exercise',
      worksheet_type: 'matching',
      language_code: 'ho',
      source_language: 'hi',
      is_active: 1,
      version: 1,
    });
    await worksheetRepository.saveWorksheet({
      id: 42,
      lesson_id: 32,
      title: 'Family Members Fill in Blanks',
      worksheet_type: 'fill_blank',
      language_code: 'ho',
      source_language: 'hi',
      is_active: 1,
      version: 1,
    });

    await worksheetRepository.saveWorksheetQuestion({
      id: 51,
      worksheet_id: 41,
      question_number: 1,
      question_text: 'What does Johar mean?',
      question_type: 'mcq',
      correct_answer: 'Greetings',
      marks: 2,
    });

    // 6. Setup Today's Attendance
    const today = new Date().toISOString().split('T')[0];
    await attendanceRepository.recordBulkAttendance([
      { student_id: 101, school_id: 1, attendance_date: today, status: 'present' },
      { student_id: 102, school_id: 1, attendance_date: today, status: 'present' },
      { student_id: 103, school_id: 1, attendance_date: today, status: 'absent', remarks: 'Fever' },
      { student_id: 104, school_id: 1, attendance_date: today, status: 'late', remarks: 'Bus late' },
    ]);

    // 7. Setup Student Evaluations
    await studentRepository.saveEvaluation({
      student_id: 101,
      assessment_id: 1,
      score: 9.0,
      max_score: 10.0,
      status: 'completed',
      remarks: 'Excellent pronunciation of Johar',
    });
    await studentRepository.saveEvaluation({
      student_id: 102,
      assessment_id: 1,
      score: 8.0,
      max_score: 10.0,
      status: 'completed',
      remarks: 'Good response',
    });
    await studentRepository.saveEvaluation({
      student_id: 103,
      worksheet_id: 41,
      score: 7.0,
      max_score: 10.0,
      status: 'completed',
      remarks: 'Needs practice with Warang Chiti script',
    });

    // Evaluation for School 2 student
    await studentRepository.saveEvaluation({
      student_id: 201,
      assessment_id: 1,
      score: 5.0,
      max_score: 10.0,
      status: 'completed',
    });
  });

  afterEach(async () => {
    await closeDatabase();
  });

  test('1. Teacher and School Context: loads assigned school and teacher details', async () => {
    const teacher = await teacherRepository.getTeacher();
    expect(teacher).not.toBeNull();
    expect(teacher?.full_name).toBe('Birsa Ho');
    expect(teacher?.preferred_language).toBe('hi');
    expect(teacher?.target_language).toBe('ho');

    const school = await schoolRepository.getSchool(teacher!.school_id);
    expect(school).not.toBeNull();
    expect(school?.name).toBe('Chaibasa Tribal Primary School');
    expect(school?.district).toBe('West Singhbhum');
  });

  test('2. Student Summary: calculates total enrolled students scoped to teacher school', async () => {
    const teacher = await teacherRepository.getTeacher();
    const schoolCount = await studentRepository.count(teacher?.school_id);
    expect(schoolCount).toBe(4); // Excludes student from school 2

    const globalCount = await studentRepository.count();
    expect(globalCount).toBe(5);
  });

  test('3. Daily Roll-Call Attendance Summary: aggregates present, absent, late, and rate %', async () => {
    const today = new Date().toISOString().split('T')[0];
    const summary = await attendanceRepository.getSummaryByDate(1, today);

    expect(summary.total).toBe(4);
    expect(summary.present).toBe(2);
    expect(summary.absent).toBe(1);
    expect(summary.late).toBe(1);
    expect(summary.excused).toBe(0);

    const rate = Math.round((summary.present / summary.total) * 1000) / 10;
    expect(rate).toBe(50.0); // 2 present out of 4 total = 50%
  });

  test('4. Assessment Evaluation Summary: calculates completed count and average score', async () => {
    const summary = await studentRepository.getEvaluationSummary(1);
    expect(summary.total).toBe(3); // 3 evaluations for School 1 students
    expect(summary.completed).toBe(3);

    // Average: (9.0 + 8.0 + 7.0) / 3 = 8.0
    expect(summary.averageScore).toBe(8.0);
  });

  test('5. Curriculum Readiness: counts classes, subjects, and available lessons', async () => {
    const classes = await curriculumRepository.getClasses();
    expect(classes.length).toBe(2);

    const subjectCount = await curriculumRepository.countSubjects();
    expect(subjectCount).toBe(2);

    const lessonCount = await curriculumRepository.countLessons();
    expect(lessonCount).toBe(2);
  });

  test('6. Worksheet Readiness: counts available worksheets and questions', async () => {
    const wsCount = await worksheetRepository.countWorksheets();
    expect(wsCount).toBe(2);

    const qCount = await worksheetRepository.countQuestions();
    expect(qCount).toBe(1);
  });

  test('7. Recent Classroom Activity Feed: retrieves recent evaluations with student names', async () => {
    const recent = await studentRepository.getRecentEvaluations(1, 5);
    expect(recent.length).toBe(3);

    expect(recent[0].student_name).toBe('Rani Kunkal');
    expect(recent[0].score).toBe(7.0);

    expect(recent[1].student_name).toBe('Jolen Kui');
    expect(recent[1].score).toBe(8.0);

    expect(recent[2].student_name).toBe('Soma Munda');
    expect(recent[2].score).toBe(9.0);
  });

  test('8. Safe Empty/Zero Data Handling: handles school with 0 attendance without division by zero', async () => {
    // School 2 has 0 attendance records
    const today = new Date().toISOString().split('T')[0];
    const summary = await attendanceRepository.getSummaryByDate(2, today);

    expect(summary.total).toBe(0);
    expect(summary.present).toBe(0);
    expect(summary.absent).toBe(0);

    const rate = summary.total > 0 ? Math.round((summary.present / summary.total) * 1000) / 10 : 0;
    expect(rate).toBe(0);
    expect(isNaN(rate)).toBe(false);

    // School with 0 evaluations
    const evalSummary = await studentRepository.getEvaluationSummary(999);
    expect(evalSummary.total).toBe(0);
    expect(evalSummary.completed).toBe(0);
    expect(evalSummary.averageScore).toBe(0);

    const recent = await studentRepository.getRecentEvaluations(999, 5);
    expect(recent).toEqual([]);
  });

  test('9. School Data Isolation: ensures metrics do not leak across schools', async () => {
    const school1Summary = await studentRepository.getEvaluationSummary(1);
    const school2Summary = await studentRepository.getEvaluationSummary(2);

    expect(school1Summary.total).toBe(3);
    expect(school2Summary.total).toBe(1);
    expect(school2Summary.averageScore).toBe(5.0);

    const school1Students = await studentRepository.count(1);
    const school2Students = await studentRepository.count(2);
    expect(school1Students).toBe(4);
    expect(school2Students).toBe(1);
  });

  test('10. Offline Resilience: all metric queries execute purely against local SQLite', async () => {
    const teacher = await teacherRepository.getTeacher();
    const schoolId = teacher?.school_id || 1;

    // Simulate complete offline dashboard aggregation
    const [
      classes,
      subCount,
      lesCount,
      wsCount,
      sCount,
      todayAttendance,
      evalSummary,
      recentActivity,
    ] = await Promise.all([
      curriculumRepository.getClasses(),
      curriculumRepository.countSubjects(),
      curriculumRepository.countLessons(),
      worksheetRepository.countWorksheets(),
      studentRepository.count(schoolId),
      attendanceRepository.getSummaryByDate(schoolId, '2026-09-07'),
      studentRepository.getEvaluationSummary(schoolId),
      studentRepository.getRecentEvaluations(schoolId, 5),
    ]);

    expect(classes.length).toBeGreaterThan(0);
    expect(subCount).toBeGreaterThan(0);
    expect(lesCount).toBeGreaterThan(0);
    expect(wsCount).toBeGreaterThan(0);
    expect(sCount).toBe(4);
    expect(todayAttendance).toBeDefined();
    expect(evalSummary).toBeDefined();
    expect(recentActivity).toBeDefined();
  });
});
