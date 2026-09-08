/**
 * PALASH Stage 2.9 Student Roster & Assessment Tests
 * Verifies offline student repository, roster filtering, and student assessment evaluations.
 */

import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  studentRepository,
  schoolRepository,
} from '../src/database';

describe('PALASH Stage 2.9 Student Roster & Assessment Evaluations', () => {
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
  });

  afterEach(async () => {
    await closeDatabase();
  });

  test('1. Save and retrieve student profile offline', async () => {
    await studentRepository.save({
      id: 1,
      school_id: 1,
      student_code: 'STU-001',
      full_name: 'Birsa Ho',
      class_name: 'Class 1',
      section: 'A',
      mother_tongue: 'ho',
      date_of_birth: '2018-05-12',
    });

    const stu = await studentRepository.findById(1);
    expect(stu).not.toBeNull();
    expect(stu?.full_name).toBe('Birsa Ho');
    expect(stu?.student_code).toBe('STU-001');
    expect(stu?.mother_tongue).toBe('ho');

    const byCode = await studentRepository.findByCode('STU-001');
    expect(byCode).not.toBeNull();
    expect(byCode?.id).toBe(1);
  });

  test('2. Filter students by school and class name', async () => {
    await studentRepository.saveMany([
      {
        id: 10,
        school_id: 1,
        student_code: 'STU-010',
        full_name: 'Anjali Kui',
        class_name: 'Class 1',
        section: 'A',
        mother_tongue: 'ho',
      },
      {
        id: 11,
        school_id: 1,
        student_code: 'STU-011',
        full_name: 'Munda Boy',
        class_name: 'Class 2',
        section: 'A',
        mother_tongue: 'ho',
      },
    ]);

    const class1Students = await studentRepository.findBySchoolId(1, 'Class 1');
    expect(class1Students.length).toBe(1);
    expect(class1Students[0].full_name).toBe('Anjali Kui');

    const allSchoolStudents = await studentRepository.findBySchoolId(1);
    expect(allSchoolStudents.length).toBe(2);
  });

  test('3. Count enrolled students offline', async () => {
    await studentRepository.saveMany([
      { id: 1, school_id: 1, student_code: 'S1', full_name: 'Stu 1', mother_tongue: 'ho' },
      { id: 2, school_id: 1, student_code: 'S2', full_name: 'Stu 2', mother_tongue: 'ho' },
      { id: 3, school_id: 1, student_code: 'S3', full_name: 'Stu 3', mother_tongue: 'ho' },
    ]);

    const total = await studentRepository.count(1);
    expect(total).toBe(3);
  });

  test('4. Record student assessment evaluation offline', async () => {
    await studentRepository.save({
      id: 5,
      school_id: 1,
      student_code: 'STU-005',
      full_name: 'Laxmi Gagrai',
      class_name: 'Class 1',
      mother_tongue: 'ho',
    });

    const evalId = await studentRepository.saveEvaluation({
      student_id: 5,
      assessment_id: 101,
      score: 9.5,
      max_score: 10.0,
      status: 'completed',
      remarks: 'उत्कृष्ट समझ (Excellent understanding of Ho words)',
    });

    expect(evalId).toBeGreaterThan(0);

    const studentEvals = await studentRepository.getEvaluationsByStudent(5);
    expect(studentEvals.length).toBe(1);
    expect(studentEvals[0].score).toBe(9.5);
    expect(studentEvals[0].status).toBe('completed');
    expect(studentEvals[0].remarks).toContain('उत्कृष्ट');
  });

  test('5. Retrieve evaluations by assessment check', async () => {
    await studentRepository.saveMany([
      { id: 1, school_id: 1, student_code: 'S1', full_name: 'Stu 1', mother_tongue: 'ho' },
      { id: 2, school_id: 1, student_code: 'S2', full_name: 'Stu 2', mother_tongue: 'ho' },
    ]);

    await studentRepository.saveEvaluation({
      student_id: 1,
      assessment_id: 200,
      score: 8.0,
      max_score: 10.0,
      status: 'completed',
    });

    await studentRepository.saveEvaluation({
      student_id: 2,
      assessment_id: 200,
      score: 7.0,
      max_score: 10.0,
      status: 'completed',
    });

    const assessmentEvals = await studentRepository.getEvaluationsByAssessment(200);
    expect(assessmentEvals.length).toBe(2);
  });
});
