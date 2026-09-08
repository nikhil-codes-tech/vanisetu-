/**
 * PALASH Stage 2.9 Bilingual Dictionary Tests
 * Verifies offline dictionary repository, search, language filtering, and lesson vocabulary.
 */

import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  dictionaryRepository,
  lessonRepository,
  learningOutcomeRepository,
  subjectRepository,
  classRepository,
} from '../src/database';

describe('PALASH Stage 2.9 Bilingual Dictionary (Ho <-> Hindi)', () => {
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

  test('1. Save and retrieve bilingual dictionary entry offline', async () => {
    await dictionaryRepository.save({
      id: 1,
      source_language: 'hi',
      source_word: 'पानी',
      target_language: 'ho',
      target_word: 'दाः',
      transliteration: 'Dah',
      part_of_speech: 'noun',
      pronunciation: 'daah',
      definition: 'Water / जल',
      example_source: 'मुझे पानी चाहिए।',
      example_target: 'अइञ् के दाः दरकार।',
      is_verified: 1,
      is_active: 1,
      version: 1,
    });

    const entry = await dictionaryRepository.findById(1);
    expect(entry).not.toBeNull();
    expect(entry?.source_word).toBe('पानी');
    expect(entry?.target_word).toBe('दाः');
    expect(entry?.transliteration).toBe('Dah');
    expect(entry?.definition).toBe('Water / जल');
  });

  test('2. Save multiple dictionary entries in a transaction', async () => {
    const entries = [
      {
        id: 101,
        source_language: 'hi',
        source_word: 'घर',
        target_language: 'ho',
        target_word: 'ओड़ाः',
        transliteration: 'Orah',
        part_of_speech: 'noun',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
      {
        id: 102,
        source_language: 'hi',
        source_word: 'सूर्य',
        target_language: 'ho',
        target_word: 'सिंगी',
        transliteration: 'Singi',
        part_of_speech: 'noun',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
      {
        id: 103,
        source_language: 'ho',
        source_word: 'हातु',
        target_language: 'hi',
        target_word: 'गाँव',
        transliteration: 'Hatu',
        part_of_speech: 'noun',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
    ];

    await dictionaryRepository.saveMany(entries);

    const count = await dictionaryRepository.count();
    expect(count).toBe(3);

    const all = await dictionaryRepository.findAll();
    expect(all.length).toBe(3);
  });

  test('3. Search dictionary across words, translations, and transliterations', async () => {
    await dictionaryRepository.saveMany([
      {
        id: 1,
        source_language: 'hi',
        source_word: 'पेड़',
        target_language: 'ho',
        target_word: 'दारु',
        transliteration: 'Daru',
        definition: 'वृक्ष / Tree',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
      {
        id: 2,
        source_language: 'hi',
        source_word: 'हाथ',
        target_language: 'ho',
        target_word: 'ती',
        transliteration: 'Ti',
        definition: 'Hand / कर',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
    ]);

    // Search by Hindi word
    const res1 = await dictionaryRepository.search('पेड़');
    expect(res1.length).toBe(1);
    expect(res1[0].target_word).toBe('दारु');

    // Search by Ho translation
    const res2 = await dictionaryRepository.search('दारु');
    expect(res2.length).toBe(1);
    expect(res2[0].source_word).toBe('पेड़');

    // Search by transliteration
    const res3 = await dictionaryRepository.search('Daru');
    expect(res3.length).toBe(1);
  });

  test('4. Filter dictionary entries by language pair', async () => {
    await dictionaryRepository.saveMany([
      {
        id: 1,
        source_language: 'hi',
        source_word: 'आग',
        target_language: 'ho',
        target_word: 'सेंगेल',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
      {
        id: 2,
        source_language: 'ho',
        source_word: 'सेंगेल',
        target_language: 'hi',
        target_word: 'अग्नि',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
    ]);

    // Filter hi -> ho
    const hiToHo = await dictionaryRepository.search('सेंगेल', 'hi', 'ho');
    expect(hiToHo.length).toBe(1);
    expect(hiToHo[0].id).toBe(1);

    // Filter ho -> hi
    const hoToHi = await dictionaryRepository.search('सेंगेल', 'ho', 'hi');
    expect(hoToHi.length).toBe(1);
    expect(hoToHi[0].id).toBe(2);
  });

  test('5. Retrieve vocabulary entries linked to a specific lesson', async () => {
    // Setup prerequisite curriculum hierarchy
    await classRepository.saveClass({ id: 1, name: 'Class 1', grade: 1, is_active: 1 });
    await subjectRepository.saveSubject({ id: 1, class_id: 1, name: 'Hindi', code: 'HI-01', is_active: 1 });
    await learningOutcomeRepository.saveLearningOutcome({ id: 1, subject_id: 1, code: 'LO-01', title: 'Vocab', is_active: 1 });
    await lessonRepository.saveLesson({ id: 10, learning_outcome_id: 1, title: 'Nature Words', lesson_number: 1, source_language: 'hi', is_active: 1 });
    await lessonRepository.saveLesson({ id: 11, learning_outcome_id: 1, title: 'Book Words', lesson_number: 2, source_language: 'hi', is_active: 1 });

    await dictionaryRepository.saveMany([
      {
        id: 1,
        lesson_id: 10,
        source_language: 'hi',
        source_word: 'नदी',
        target_language: 'ho',
        target_word: 'गड़ा',
        transliteration: 'Gada',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
      {
        id: 2,
        lesson_id: 11, // Second valid lesson
        source_language: 'hi',
        source_word: 'पुस्तक',
        target_language: 'ho',
        target_word: 'पुथी',
        is_verified: 1,
        is_active: 1,
        version: 1,
      },
    ]);

    const lessonVocab = await dictionaryRepository.findByLessonId(10);
    expect(lessonVocab.length).toBe(1);
    expect(lessonVocab[0].source_word).toBe('नदी');
    expect(lessonVocab[0].target_word).toBe('गड़ा');
  });
});
