/**
 * PALASH Bilingual Dictionary & Word Bank Screen (Ho <-> Hindi)
 * Provides teachers with offline vocabulary lookup, Ol Chiki / Devanagari transliteration,
 * definitions, and contextual example sentences.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '../../navigation/NavigationContext';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { dictionaryRepository } from '../../database';
import { DictionaryEntryRecord } from '../../database/types/database';

export const DictionaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const params = navigation.currentRoute.params as { lessonId?: number; lessonTitle?: string } | undefined;

  const [query, setQuery] = useState('');
  const [langFilter, setLangFilter] = useState<'all' | 'hi_to_ho' | 'ho_to_hi'>('all');
  const [entries, setEntries] = useState<DictionaryEntryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadEntries = async (searchQuery: string = '', filter = langFilter) => {
    setLoading(true);
    try {
      if (params?.lessonId && !searchQuery.trim()) {
        const lessonEntries = await dictionaryRepository.findByLessonId(params.lessonId);
        setEntries(lessonEntries);
      } else if (searchQuery.trim()) {
        const srcLang = filter === 'hi_to_ho' ? 'hi' : filter === 'ho_to_hi' ? 'ho' : undefined;
        const tgtLang = filter === 'hi_to_ho' ? 'ho' : filter === 'ho_to_hi' ? 'hi' : undefined;
        const results = await dictionaryRepository.search(searchQuery, srcLang, tgtLang);
        setEntries(results);
      } else {
        const allEntries = await dictionaryRepository.findAll(100);
        setEntries(allEntries);
      }
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries(query, langFilter);
  }, [langFilter]);

  const handleSearch = (text: string) => {
    setQuery(text);
    loadEntries(text, langFilter);
  };

  const renderEntry = ({ item }: { item: DictionaryEntryRecord }) => (
    <Card style={styles.entryCard}>
      <View style={styles.wordRow}>
        <View style={styles.wordBlock}>
          <Text style={styles.langBadge}>{item.source_language.toUpperCase()}</Text>
          <Text style={styles.sourceWord}>{item.source_word}</Text>
        </View>

        <Text style={styles.arrow}>➔</Text>

        <View style={styles.wordBlock}>
          <Text style={styles.langBadge}>{item.target_language.toUpperCase()}</Text>
          <Text style={styles.targetWord}>{item.target_word}</Text>
        </View>
      </View>

      {item.transliteration ? (
        <Text style={styles.transliteration}>
          उच्चारण / Transliteration: <Text style={styles.highlightText}>{item.transliteration}</Text>
        </Text>
      ) : null}

      {item.part_of_speech ? (
        <Text style={styles.metaText}>
          शब्द भेद: <Text style={styles.italic}>{item.part_of_speech}</Text>
        </Text>
      ) : null}

      {item.definition ? (
        <View style={styles.defBox}>
          <Text style={styles.defTitle}>अर्थ (Meaning):</Text>
          <Text style={styles.defText}>{item.definition}</Text>
        </View>
      ) : null}

      {item.example_source ? (
        <View style={styles.exampleBox}>
          <Text style={styles.exampleLabel}>उदाहरण (Example):</Text>
          <Text style={styles.exampleSource}>• {item.example_source}</Text>
          {item.example_target ? (
            <Text style={styles.exampleTarget}>  {item.example_target}</Text>
          ) : null}
        </View>
      ) : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title={params?.lessonTitle ? `शब्दकोश: ${params.lessonTitle}` : 'द्विभाषी शब्दकोश (Ho ↔ Hindi)'}
        subtitle="Mother Tongue Based Multilingual Word Bank"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <OfflineBanner />

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="शब्द खोजें (Search Hindi or Ho word)..."
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={handleSearch}
          testID="dict-search-input"
        />

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterTab, langFilter === 'all' && styles.filterTabActive]}
            onPress={() => setLangFilter('all')}
          >
            <Text style={[styles.filterTabText, langFilter === 'all' && styles.filterTabTextActive]}>
              सभी (All)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, langFilter === 'hi_to_ho' && styles.filterTabActive]}
            onPress={() => setLangFilter('hi_to_ho')}
          >
            <Text style={[styles.filterTabText, langFilter === 'hi_to_ho' && styles.filterTabTextActive]}>
              हिन्दी ➔ हो
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, langFilter === 'ho_to_hi' && styles.filterTabActive]}
            onPress={() => setLangFilter('ho_to_hi')}
          >
            <Text style={[styles.filterTabText, langFilter === 'ho_to_hi' && styles.filterTabTextActive]}>
              हो ➔ हिन्दी
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>शब्दावली लोड हो रही है...</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyTitle}>कोई शब्द नहीं मिला</Text>
          <Text style={styles.emptySubtitle}>No vocabulary entries found for this query.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderEntry}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  filterTabActive: {
    backgroundColor: '#059669',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  entryCard: {
    marginBottom: 12,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  wordBlock: {
    flex: 1,
  },
  langBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  sourceWord: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  targetWord: {
    fontSize: 18,
    fontWeight: '700',
    color: '#047857',
  },
  arrow: {
    fontSize: 18,
    color: '#9ca3af',
    paddingHorizontal: 8,
  },
  transliteration: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
  },
  highlightText: {
    fontWeight: '700',
    color: '#2563eb',
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  italic: {
    fontStyle: 'italic',
  },
  defBox: {
    marginTop: 8,
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 6,
  },
  defTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  defText: {
    fontSize: 14,
    color: '#15803d',
    marginTop: 2,
  },
  exampleBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 2,
  },
  exampleSource: {
    fontSize: 13,
    color: '#1f2937',
  },
  exampleTarget: {
    fontSize: 13,
    color: '#047857',
    fontStyle: 'italic',
    marginTop: 2,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});
