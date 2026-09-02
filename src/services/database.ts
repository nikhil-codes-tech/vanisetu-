import { StudentProgressRecord, SyncQueueItem, VocabularyWord } from '../types/models';
import { DICTIONARY_WORDS } from '../utils/dictionaryData';

class SQLiteOfflineDB {
  private words: VocabularyWord[] = [...DICTIONARY_WORDS];
  private progressRecords: StudentProgressRecord[] = [];
  private syncQueue: SyncQueueItem[] = [];

  constructor() {
    this.initDefaultRecords();
  }

  private initDefaultRecords() {
    this.progressRecords = [
      { id: 'p1', studentId: 'S01', studentName: 'बिरसा मुंडा', grade: '1', subject: 'math', competencyCode: 'M1.1', score: 92, lastAssessedAt: new Date().toISOString(), synced: true },
      { id: 'p2', studentId: 'S02', studentName: 'सोनाली सोरेन', grade: '1', subject: 'hindi', competencyCode: 'H1.1', score: 88, lastAssessedAt: new Date().toISOString(), synced: true },
      { id: 'p3', studentId: 'S03', studentName: 'जयपाल सिंह', grade: '2', subject: 'science', competencyCode: 'S2.1', score: 78, lastAssessedAt: new Date().toISOString(), synced: false },
      { id: 'p4', studentId: 'S04', studentName: 'मालती बानरा', grade: '3', subject: 'evs', competencyCode: 'E3.2', score: 95, lastAssessedAt: new Date().toISOString(), synced: false },
      { id: 'p5', studentId: 'S05', studentName: 'रोशन पूर्ति', grade: '2', subject: 'math', competencyCode: 'M2.3', score: 84, lastAssessedAt: new Date().toISOString(), synced: true },
    ];
  }

  public async getVocabulary(category?: string, query?: string): Promise<VocabularyWord[]> {
    let result = this.words;
    if (category && category !== 'All') {
      result = result.filter(w => w.category.toLowerCase() === category.toLowerCase());
    }
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      result = result.filter(w =>
        w.english.toLowerCase().includes(q) ||
        w.hindi.toLowerCase().includes(q) ||
        w.ho.toLowerCase().includes(q) ||
        w.santhali.toLowerCase().includes(q) ||
        w.mundari.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public async getStudentProgress(): Promise<StudentProgressRecord[]> {
    return this.progressRecords;
  }

  public async saveStudentProgress(record: Omit<StudentProgressRecord, 'id' | 'synced'>): Promise<StudentProgressRecord> {
    const newRecord: StudentProgressRecord = {
      ...record,
      id: `p_${Date.now()}`,
      synced: false,
    };
    this.progressRecords.unshift(newRecord);

    // Queue for sync
    this.queueSyncItem({
      eventType: 'PROGRESS_UPDATE',
      payloadJson: JSON.stringify(newRecord),
    });

    return newRecord;
  }

  public async queueSyncItem(item: { eventType: SyncQueueItem['eventType']; payloadJson: string }): Promise<void> {
    const queueItem: SyncQueueItem = {
      id: `sq_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      eventType: item.eventType,
      payloadJson: item.payloadJson,
      createdAt: new Date().toISOString(),
      attempts: 0,
      status: 'PENDING',
    };
    this.syncQueue.push(queueItem);
  }

  public async getPendingSyncQueue(): Promise<SyncQueueItem[]> {
    return this.syncQueue.filter(i => i.status === 'PENDING');
  }

  public async markQueueItemSynced(id: string): Promise<void> {
    const found = this.syncQueue.find(i => i.id === id);
    if (found) {
      found.status = 'SYNCED';
    }
  }
}

export const dbService = new SQLiteOfflineDB();
