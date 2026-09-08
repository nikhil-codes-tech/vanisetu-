import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  teacherRepository,
  schoolRepository,
  curriculumClassRepository,
  classRepository,
  subjectRepository,
  learningOutcomeRepository,
  lessonRepository,
  activityRepository,
  assessmentRepository,
  worksheetRepository,
  worksheetQuestionRepository,
} from '../src/database';

describe('PALASH Stage 2.6.2 Offline Repository Layer Tests', () => {
  let sqlJsInstance: any;
  let SQL: any;

  beforeEach(async () => {
    SQL = await initSqlJs();
    sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  test('A. Teacher can be saved and retrieved offline', async () => {
    // Setup prerequisite school
    await schoolRepository.saveSchool({
      id: 1,
      school_code: 'SCH-JH-001',
      name: 'Utkramit Madhya Vidyalaya, Kolhan',
      district: 'West Singhbhum',
    });

    // Save Teacher
    await teacherRepository.saveTeacher({
      id: 1,
      user_id: 201,
      school_id: 1,
      teacher_code: 'TCH-JH-001',
      full_name: 'Sukram Munda',
      phone: '9876501234',
      preferred_language: 'hi',
      target_language: 'ho',
    });

    // Retrieve specific teacher
    const teacher = await teacherRepository.getTeacher(1);
    expect(teacher).not.toBeNull();
    expect(teacher?.teacher_code).toBe('TCH-JH-001');
    expect(teacher?.full_name).toBe('Sukram Munda');
    expect(teacher?.preferred_language).toBe('hi');
    expect(teacher?.target_language).toBe('ho');

    // Retrieve default active teacher (no ID passed)
    const defaultTeacher = await teacherRepository.getTeacher();
    expect(defaultTeacher).not.toBeNull();
    expect(defaultTeacher?.id).toBe(1);

    // Update teacher offline
    await teacherRepository.saveTeacher({
      id: 1,
      user_id: 201,
      school_id: 1,
      teacher_code: 'TCH-JH-001',
      full_name: 'Sukram Munda (Sr. Teacher)',
      phone: '9876501234',
      preferred_language: 'hi',
      target_language: 'ho',
    });

    const updated = await teacherRepository.getTeacher(1);
    expect(updated?.full_name).toBe('Sukram Munda (Sr. Teacher)');
  });

  test('B. School can be saved and retrieved offline', async () => {
    await schoolRepository.saveSchool({
      id: 10,
      school_code: 'SCH-JH-010',
      name: 'Prathmik Vidyalaya, Torpa',
      district: 'Khunti',
      block: 'Torpa',
      cluster: 'Torpa North',
      village: 'Dorma',
      address: 'Near Torpa Block Office',
    });

    const school = await schoolRepository.getSchool(10);
    expect(school).not.toBeNull();
    expect(school?.school_code).toBe('SCH-JH-010');
    expect(school?.name).toBe('Prathmik Vidyalaya, Torpa');
    expect(school?.district).toBe('Khunti');
    expect(school?.village).toBe('Dorma');

    // Update school offline
    await schoolRepository.saveSchool({
      id: 10,
      school_code: 'SCH-JH-010',
      name: 'Prathmik Vidyalaya, Torpa (Upgraded)',
      district: 'Khunti',
      block: 'Torpa',
      cluster: 'Torpa North',
      village: 'Dorma',
      address: 'Near Torpa Block Office',
    });

    const updated = await schoolRepository.getSchool(10);
    expect(updated?.name).toBe('Prathmik Vidyalaya, Torpa (Upgraded)');
  });

  test('C. Curriculum hierarchy can be saved and retrieved offline: Class -> Subject -> Learning Outcome -> Lesson -> Activity / Assessment', async () => {
    // 1. Class
    await curriculumClassRepository.saveClass({
      id: 2,
      name: 'Class 2',
      grade: 2,
      description: 'Foundational Stage Grade 2',
      is_active: 1,
    });
    const classes = await classRepository.getClasses();
    expect(classes.length).toBe(1);
    expect(classes[0].name).toBe('Class 2');

    // 2. Subject
    await subjectRepository.saveSubject({
      id: 20,
      class_id: 2,
      name: 'Mathematics (Ganit)',
      code: 'MATH2',
      description: 'Foundational Numeracy',
      is_active: 1,
    });
    const subjects = await subjectRepository.getSubjectsByClass(2);
    expect(subjects.length).toBe(1);
    expect(subjects[0].code).toBe('MATH2');

    // 3. Learning Outcome
    await learningOutcomeRepository.saveLearningOutcome({
      id: 200,
      subject_id: 20,
      code: 'LO-MATH-2.1',
      title: 'Counting and Number Sense',
      description: 'Counts objects up to 20 in Ho and Hindi',
      nipun_domain: 'Foundational Numeracy',
      is_active: 1,
    });
    const outcomes = await learningOutcomeRepository.getLearningOutcomesBySubject(20);
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].code).toBe('LO-MATH-2.1');

    // 4. Lesson
    await lessonRepository.saveLesson({
      id: 2000,
      learning_outcome_id: 200,
      title: 'Numbers 1 to 10 with Local Seeds',
      lesson_number: 1,
      source_language: 'hi',
      duration_minutes: 35,
      teacher_script: 'Use tamarind seeds to count: Mi, Bar, Pei in Ho.',
      learning_objective: 'Count up to 10 using concrete objects in mother tongue.',
      is_active: 1,
    });
    const lessons = await lessonRepository.getLessonsByOutcome(200);
    expect(lessons.length).toBe(1);
    expect(lessons[0].title).toBe('Numbers 1 to 10 with Local Seeds');

    const lessonDetail = await lessonRepository.getLesson(2000);
    expect(lessonDetail).not.toBeNull();
    expect(lessonDetail?.duration_minutes).toBe(35);
    expect(lessonDetail?.teacher_script).toContain('tamarind seeds');

    // 5. Activity
    await activityRepository.saveActivity({
      id: 5001,
      lesson_id: 2000,
      title: 'Seed Counting in Pairs',
      activity_type: 'hands_on_counting',
      instructions: 'Each student pairs up and counts 10 tamarind seeds.',
      sequence_order: 1,
      materials: 'Tamarind seeds (tetli jan)',
      is_active: 1,
    });
    const activities = await activityRepository.getActivitiesByLesson(2000);
    expect(activities.length).toBe(1);
    expect(activities[0].title).toBe('Seed Counting in Pairs');
    expect(activities[0].activity_type).toBe('hands_on_counting');

    // 6. Assessment
    await assessmentRepository.saveAssessment({
      id: 6001,
      lesson_id: 2000,
      title: 'Quick Count Check',
      prompt: 'Show 5 seeds and ask: How many seeds are there?',
      assessment_type: 'oral_practical',
      sequence_order: 1,
      expected_response: 'Mone / Panch (5)',
      is_active: 1,
    });
    const assessments = await assessmentRepository.getAssessmentsByLesson(2000);
    expect(assessments.length).toBe(1);
    expect(assessments[0].title).toBe('Quick Count Check');
    expect(assessments[0].expected_response).toContain('Mone');
  });

  test('D. Worksheet can be saved and retrieved offline', async () => {
    // Setup prerequisite parent chain
    await curriculumClassRepository.saveClass({ id: 1, name: 'Class 1', grade: 1, is_active: 1 });
    await subjectRepository.saveSubject({ id: 1, class_id: 1, name: 'Language', code: 'LANG1', is_active: 1 });
    await learningOutcomeRepository.saveLearningOutcome({ id: 1, subject_id: 1, code: 'LO-1', title: 'Words', is_active: 1 });
    await lessonRepository.saveLesson({ id: 1, learning_outcome_id: 1, title: 'Animals', lesson_number: 1, source_language: 'hi', is_active: 1 });

    // Save Worksheet
    await worksheetRepository.saveWorksheet({
      id: 101,
      lesson_id: 1,
      title: 'Animals in Tribal Context',
      description: 'Learn animal names in Ho and Hindi',
      language_code: 'hi',
      source_language: 'hi',
      worksheet_type: 'vocabulary_matching',
      difficulty_level: 'beginner',
      instructions: 'Match each animal picture with its Ho name.',
      content: JSON.stringify({ theme: 'animals', count: 5 }),
      answer_key: JSON.stringify({ 1: 'Kula (Tiger)', 2: 'Hati (Elephant)' }),
      version: 1,
      is_active: 1,
    });

    // Retrieve via getWorksheetsByLesson
    const worksheets = await worksheetRepository.getWorksheetsByLesson(1);
    expect(worksheets.length).toBe(1);
    expect(worksheets[0].id).toBe(101);
    expect(worksheets[0].title).toBe('Animals in Tribal Context');

    // Retrieve via getWorksheet (by ID)
    const single = await worksheetRepository.getWorksheet(101);
    expect(single).not.toBeNull();
    expect(single?.worksheet_type).toBe('vocabulary_matching');
    expect(single?.difficulty_level).toBe('beginner');
    expect(single?.answer_key).toContain('Kula');
  });

  test('E. Worksheet questions can be saved and retrieved offline', async () => {
    // Setup prerequisite
    await curriculumClassRepository.saveClass({ id: 1, name: 'Class 1', grade: 1, is_active: 1 });
    await subjectRepository.saveSubject({ id: 1, class_id: 1, name: 'Language', code: 'LANG1', is_active: 1 });
    await learningOutcomeRepository.saveLearningOutcome({ id: 1, subject_id: 1, code: 'LO-1', title: 'Words', is_active: 1 });
    await lessonRepository.saveLesson({ id: 1, learning_outcome_id: 1, title: 'Animals', lesson_number: 1, source_language: 'hi', is_active: 1 });
    await worksheetRepository.saveWorksheet({
      id: 1,
      lesson_id: 1,
      title: 'Animal Worksheet',
      language_code: 'hi',
      source_language: 'hi',
      worksheet_type: 'mcq',
      version: 1,
      is_active: 1,
    });

    // Save single question via saveQuestion
    await worksheetQuestionRepository.saveQuestion({
      id: 1001,
      worksheet_id: 1,
      question_number: 1,
      question_text: 'What is "Tiger" called in Ho?',
      question_type: 'multiple_choice',
      options: JSON.stringify(['Kula', 'Setah', 'Sadam', 'Uri']),
      correct_answer: 'Kula',
      explanation: 'In Ho language, tiger is called Kula.',
      marks: 1,
    });

    // Save second question via saveQuestion
    await worksheetQuestionRepository.saveQuestion({
      id: 1002,
      worksheet_id: 1,
      question_number: 2,
      question_text: 'What is "Horse" called in Ho?',
      question_type: 'multiple_choice',
      options: JSON.stringify(['Sadam', 'Kula', 'Setah', 'Merom']),
      correct_answer: 'Sadam',
      explanation: 'In Ho language, horse is called Sadam.',
      marks: 1,
    });

    const questions = await worksheetQuestionRepository.getQuestionsByWorksheet(1);
    expect(questions.length).toBe(2);
    expect(questions[0].question_number).toBe(1);
    expect(questions[0].correct_answer).toBe('Kula');
    expect(questions[1].question_number).toBe(2);
    expect(questions[1].correct_answer).toBe('Sadam');
  });

  test('F. Data remains available after closing and reopening the SQLite connection', async () => {
    // 1. Populate data across school, teacher, curriculum, worksheet, question
    await schoolRepository.saveSchool({
      id: 5,
      school_code: 'SCH-PERSIST',
      name: 'Persisted Tribal School',
      district: 'Ranchi',
    });

    await teacherRepository.saveTeacher({
      id: 5,
      user_id: 505,
      school_id: 5,
      teacher_code: 'TCH-PERSIST',
      full_name: 'Rani Kumari',
      preferred_language: 'hi',
      target_language: 'ho',
    });

    await curriculumClassRepository.saveClass({ id: 5, name: 'Class 5', grade: 5, is_active: 1 });
    await subjectRepository.saveSubject({ id: 50, class_id: 5, name: 'Science', code: 'SCI5', is_active: 1 });
    await learningOutcomeRepository.saveLearningOutcome({ id: 500, subject_id: 50, code: 'LO-SCI-5', title: 'Plants', is_active: 1 });
    await lessonRepository.saveLesson({ id: 5000, learning_outcome_id: 500, title: 'Forest Flora', lesson_number: 1, source_language: 'hi', is_active: 1 });
    await worksheetRepository.saveWorksheet({
      id: 50000,
      lesson_id: 5000,
      title: 'Sal Tree Worksheet',
      language_code: 'hi',
      source_language: 'hi',
      worksheet_type: 'study',
      version: 1,
      is_active: 1,
    });
    await worksheetQuestionRepository.saveQuestion({
      id: 70001,
      worksheet_id: 50000,
      question_number: 1,
      question_text: 'What is the sacred tree of the Sarhul festival?',
      question_type: 'single_choice',
      options: JSON.stringify(['Sal / Sarjom', 'Banyan', 'Neem']),
      correct_answer: 'Sal / Sarjom',
      marks: 1,
    });

    // 2. Export SQLite database bytes to simulate persistence on disk
    const exportedBuffer = sqlJsInstance.export();

    // 3. Close the active database connection
    await closeDatabase();

    // 4. Reopen connection using the persisted database bytes
    const reloadedDbInstance = new SQL.Database(exportedBuffer);
    const reloadedDriver = new SqlJsDriver(reloadedDbInstance);
    await initializeDatabase(reloadedDriver);

    // 5. Verify all data remains intact across repositories
    const school = await schoolRepository.getSchool(5);
    expect(school?.name).toBe('Persisted Tribal School');

    const teacher = await teacherRepository.getTeacher(5);
    expect(teacher?.full_name).toBe('Rani Kumari');

    const classes = await curriculumClassRepository.getClasses();
    expect(classes.some((c) => c.name === 'Class 5')).toBe(true);

    const subjects = await subjectRepository.getSubjectsByClass(5);
    expect(subjects.length).toBe(1);
    expect(subjects[0].code).toBe('SCI5');

    const outcomes = await learningOutcomeRepository.getLearningOutcomesBySubject(50);
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].code).toBe('LO-SCI-5');

    const lesson = await lessonRepository.getLesson(5000);
    expect(lesson?.title).toBe('Forest Flora');

    const worksheet = await worksheetRepository.getWorksheet(50000);
    expect(worksheet?.title).toBe('Sal Tree Worksheet');

    const questions = await worksheetQuestionRepository.getQuestionsByWorksheet(50000);
    expect(questions.length).toBe(1);
    expect(questions[0].correct_answer).toBe('Sal / Sarjom');
  });

  test('G. Foreign-key constraints remain enforced', async () => {
    // 1. Teacher cannot reference non-existent school
    await expect(
      teacherRepository.saveTeacher({
        id: 999,
        user_id: 999,
        school_id: 99999, // Invalid
        teacher_code: 'INVALID-TCH',
        full_name: 'No School Teacher',
        preferred_language: 'hi',
        target_language: 'ho',
      })
    ).rejects.toThrow();

    // 2. Subject cannot reference non-existent class
    await expect(
      subjectRepository.saveSubject({
        id: 999,
        class_id: 99999, // Invalid
        name: 'Invalid Subject',
        code: 'INV',
        is_active: 1,
      })
    ).rejects.toThrow();

    // 3. Learning outcome cannot reference non-existent subject
    await expect(
      learningOutcomeRepository.saveLearningOutcome({
        id: 999,
        subject_id: 99999, // Invalid
        code: 'INV-LO',
        title: 'Invalid LO',
        is_active: 1,
      })
    ).rejects.toThrow();

    // 4. Lesson cannot reference non-existent learning outcome
    await expect(
      lessonRepository.saveLesson({
        id: 999,
        learning_outcome_id: 99999, // Invalid
        title: 'Invalid Lesson',
        lesson_number: 1,
        source_language: 'hi',
        is_active: 1,
      })
    ).rejects.toThrow();

    // 5. Worksheet cannot reference non-existent lesson
    await expect(
      worksheetRepository.saveWorksheet({
        id: 999,
        lesson_id: 99999, // Invalid
        title: 'Invalid Worksheet',
        language_code: 'hi',
        source_language: 'hi',
        worksheet_type: 'test',
        version: 1,
        is_active: 1,
      })
    ).rejects.toThrow();

    // 6. Worksheet question cannot reference non-existent worksheet
    await expect(
      worksheetQuestionRepository.saveQuestion({
        id: 999,
        worksheet_id: 99999, // Invalid
        question_number: 1,
        question_text: 'Invalid Question',
        question_type: 'mcq',
        marks: 1,
      })
    ).rejects.toThrow();
  });

  test('H. Repository operations do not require network access', async () => {
    // Mock global fetch to throw error if any network request is attempted
    const originalFetch = (global as any).fetch;
    const fetchMock = jest.fn().mockImplementation(() => {
      throw new Error('NETWORK CALL DETECTED: Repositories must operate strictly offline!');
    });
    (global as any).fetch = fetchMock;

    try {
      // Execute read and write operations across all offline repositories
      await schoolRepository.saveSchool({
        id: 7,
        school_code: 'SCH-OFFLINE',
        name: 'Strictly Offline School',
        district: 'Simdega',
      });
      const school = await schoolRepository.getSchool(7);
      expect(school).not.toBeNull();

      await teacherRepository.saveTeacher({
        id: 7,
        user_id: 707,
        school_id: 7,
        teacher_code: 'TCH-OFFLINE',
        full_name: 'Offline Teacher',
        preferred_language: 'hi',
        target_language: 'ho',
      });
      const teacher = await teacherRepository.getTeacher(7);
      expect(teacher).not.toBeNull();

      await curriculumClassRepository.saveClass({ id: 7, name: 'Class 7', grade: 7, is_active: 1 });
      const classes = await curriculumClassRepository.getClasses();
      expect(classes.length).toBeGreaterThanOrEqual(1);

      await subjectRepository.saveSubject({ id: 70, class_id: 7, name: 'Social Studies', code: 'SST7', is_active: 1 });
      const subjects = await subjectRepository.getSubjectsByClass(7);
      expect(subjects.length).toBe(1);

      await learningOutcomeRepository.saveLearningOutcome({ id: 700, subject_id: 70, code: 'LO-700', title: 'Local Governance', is_active: 1 });
      const outcomes = await learningOutcomeRepository.getLearningOutcomesBySubject(70);
      expect(outcomes.length).toBe(1);

      await lessonRepository.saveLesson({ id: 7000, learning_outcome_id: 700, title: 'Gram Sabha', lesson_number: 1, source_language: 'hi', is_active: 1 });
      const lesson = await lessonRepository.getLesson(7000);
      expect(lesson?.title).toBe('Gram Sabha');

      await activityRepository.saveActivity({ id: 70001, lesson_id: 7000, title: 'Mock Gram Sabha', activity_type: 'roleplay', sequence_order: 1, is_active: 1 });
      const activities = await activityRepository.getActivitiesByLesson(7000);
      expect(activities.length).toBe(1);

      await assessmentRepository.saveAssessment({ id: 70002, lesson_id: 7000, title: 'Quiz', prompt: 'Who heads Gram Sabha?', assessment_type: 'oral', sequence_order: 1, is_active: 1 });
      const assessments = await assessmentRepository.getAssessmentsByLesson(7000);
      expect(assessments.length).toBe(1);

      await worksheetRepository.saveWorksheet({
        id: 70003,
        lesson_id: 7000,
        title: 'Gram Sabha Worksheet',
        language_code: 'hi',
        source_language: 'hi',
        worksheet_type: 'mcq',
        version: 1,
        is_active: 1,
      });
      const worksheet = await worksheetRepository.getWorksheet(70003);
      expect(worksheet).not.toBeNull();


      await worksheetQuestionRepository.saveQuestion({
        id: 70004,
        worksheet_id: 70003,
        question_number: 1,
        question_text: 'What is the role of Munda in village governance?',
        question_type: 'open_ended',
        marks: 2,
      });
      const questions = await worksheetQuestionRepository.getQuestionsByWorksheet(70003);
      expect(questions.length).toBe(1);

      // Verify that fetch was never invoked
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      (global as any).fetch = originalFetch;
    }
  });
});
