#ifdef _WIN32
#include <windows.h>
#endif
#include <iostream>
#include <sstream>
#include <string>
#include <vector>


struct PhraseEntry {
  std::string lang;
  std::string src;
  std::string tgt;
};

struct VocabEntry {
  std::string lang;
  std::string hindiWord;
  std::string tribalWord;
};

class UniversalEdgeTranslator {
private:
  std::vector<PhraseEntry> fullPhrases;
  std::vector<VocabEntry> lexicon;

  std::string trim(const std::string &str) {
    size_t first = str.find_first_not_of(" \t\r\n।?,.!");
    if (first == std::string::npos)
      return "";
    size_t last = str.find_last_not_of(" \t\r\n।?,.!");
    return str.substr(first, (last - first + 1));
  }

  std::vector<std::string> splitTokens(const std::string &text) {
    std::vector<std::string> tokens;
    std::stringstream ss(text);
    std::string token;
    while (ss >> token) {
      std::string cleaned = trim(token);
      if (!cleaned.empty()) {
        tokens.push_back(cleaned);
      }
    }
    return tokens;
  }

public:
  UniversalEdgeTranslator() { initData(); }

  void initData() {
    fullPhrases.clear();
    lexicon.clear();

    // --- Exact Phrases ---
    fullPhrases.push_back(
        {"hoc", "बच्चों अपनी किताबें निकालो", "होनको आपन पुथी ओलोंग पे"});
    fullPhrases.push_back(
        {"sat", "बच्चों अपनी किताबें निकालो", "गिदराको आपनाः पुथी ओडोक पे"});
    fullPhrases.push_back(
        {"unr", "बच्चों अपनी किताबें निकालो", "होनको आपनाः पुथी ओलोंग पे"});

    fullPhrases.push_back({"hoc", "हेलो क्या कर रहे हो", "जोहार, चेनाः चिकेय तना?"});
    fullPhrases.push_back({"sat", "हेलो क्या कर रहे हो", "जोहार, चेत एम चेकायेत-आ?"});
    fullPhrases.push_back({"unr", "हेलो क्या कर रहे हो", "जोहार, चिनाः चिके तन?"});

    // --- Core Vocabulary & Morphological Roots ---
    // Ho (hoc)
    lexicon.push_back({"hoc", "नमस्ते", "जोहार"});
    lexicon.push_back({"hoc", "हेलो", "जोहार"});
    lexicon.push_back({"hoc", "क्या", "चेनाः"});
    lexicon.push_back({"hoc", "कर", "चिकय"});
    lexicon.push_back({"hoc", "रहे", "तना"});
    lexicon.push_back({"hoc", "हो", "तना"});
    lexicon.push_back({"hoc", "तुम", "अम"});
    lexicon.push_back({"hoc", "आप", "अपे"});
    lexicon.push_back({"hoc", "मैं", "आईंग"});
    lexicon.push_back({"hoc", "हम", "आले"});
    lexicon.push_back({"hoc", "बच्चे", "होनको"});
    lexicon.push_back({"hoc", "बच्चों", "होनको"});
    lexicon.push_back({"hoc", "किताब", "पुथी"});
    lexicon.push_back({"hoc", "किताबें", "पुथी"});
    lexicon.push_back({"hoc", "पानी", "दाः"});
    lexicon.push_back({"hoc", "घर", "ओड़ाः"});
    lexicon.push_back({"hoc", "स्कूल", "इतुकुल"});
    lexicon.push_back({"hoc", "विद्यालय", "इतुकुल"});
    lexicon.push_back({"hoc", "खाना", "मंडी"});
    lexicon.push_back({"hoc", "खाओ", "जोम पे"});
    lexicon.push_back({"hoc", "पियो", "नुइ पे"});
    lexicon.push_back({"hoc", "पढ़ो", "पाढ़ाव पे"});
    lexicon.push_back({"hoc", "लिखो", "ओलोंग पे"});
    lexicon.push_back({"hoc", "जाओ", "सेनोः पे"});
    lexicon.push_back({"hoc", "आओ", "हिजुः मे"});
    lexicon.push_back({"hoc", "यहाँ", "नेपाः"});
    lexicon.push_back({"hoc", "वहाँ", "एंटे"});
    lexicon.push_back({"hoc", "बैठो", "दुब पे"});
    lexicon.push_back({"hoc", "शांत", "थिर"});
    lexicon.push_back({"hoc", "आज", "तेइसिंग"});
    lexicon.push_back({"hoc", "कल", "गापा"});
    lexicon.push_back({"hoc", "अच्छा", "बुगिया"});
    lexicon.push_back({"hoc", "नाम", "नुतुम"});

    // Santhali (sat)
    lexicon.push_back({"sat", "नमस्ते", "जोहार"});
    lexicon.push_back({"sat", "हेलो", "जोहार"});
    lexicon.push_back({"sat", "क्या", "चेत"});
    lexicon.push_back({"sat", "कर", "कामी"});
    lexicon.push_back({"sat", "तुम", "आम"});
    lexicon.push_back({"sat", "आप", "आपे"});
    lexicon.push_back({"sat", "मैं", "इंज"});
    lexicon.push_back({"sat", "हम", "आबो"});
    lexicon.push_back({"sat", "बच्चे", "गिदराको"});
    lexicon.push_back({"sat", "बच्चों", "गिदराको"});
    lexicon.push_back({"sat", "किताब", "पुथी"});
    lexicon.push_back({"sat", "पानी", "दाः"});
    lexicon.push_back({"sat", "घर", "ओड़ाः"});
    lexicon.push_back({"sat", "स्कूल", "आसड़ा"});
    lexicon.push_back({"sat", "खाना", "दाका"});
    lexicon.push_back({"sat", "जाओ", "सेन मे"});
    lexicon.push_back({"sat", "आओ", "हिजुः मे"});
    lexicon.push_back({"sat", "यहाँ", "नोंडे"});
    lexicon.push_back({"sat", "आज", "तेहेंज"});
    lexicon.push_back({"sat", "नाम", "ञुतूम"});

    // Mundari (unr)
    lexicon.push_back({"unr", "नमस्ते", "जोहार"});
    lexicon.push_back({"unr", "हेलो", "जोहार"});
    lexicon.push_back({"unr", "क्या", "चिनाः"});
    lexicon.push_back({"unr", "कर", "कमी"});
    lexicon.push_back({"unr", "तुम", "अम"});
    lexicon.push_back({"unr", "आप", "अपे"});
    lexicon.push_back({"unr", "मैं", "ऐंग"});
    lexicon.push_back({"unr", "हम", "अले"});
    lexicon.push_back({"unr", "बच्चे", "होनको"});
    lexicon.push_back({"unr", "बच्चों", "होनको"});
    lexicon.push_back({"unr", "किताब", "पुथी"});
    lexicon.push_back({"unr", "पानी", "दाः"});
    lexicon.push_back({"unr", "घर", "ओड़ाः"});
    lexicon.push_back({"unr", "स्कूल", "इतुकुल"});
    lexicon.push_back({"unr", "खाना", "मंडी"});
    lexicon.push_back({"unr", "जाओ", "सेन मे"});
    lexicon.push_back({"unr", "आओ", "हिजुः मे"});
    lexicon.push_back({"unr", "यहाँ", "नेते"});
    lexicon.push_back({"unr", "आज", "तिसिंग"});
    lexicon.push_back({"unr", "नाम", "नुतुम"});
  }

  std::string translateWord(const std::string &word,
                            const std::string &targetLang) {
    for (size_t i = 0; i < lexicon.size(); ++i) {
      if (lexicon[i].lang == targetLang && lexicon[i].hindiWord == word) {
        return lexicon[i].tribalWord;
      }
    }
    return word; // Retain original term (transliterated/loan word) if absent
  }

  std::string translateSentence(const std::string &rawInput,
                                const std::string &targetLang) {
    std::string query = trim(rawInput);
    if (query.empty())
      return "";

    // 1. Check full phrase match
    for (size_t i = 0; i < fullPhrases.size(); ++i) {
      if (fullPhrases[i].lang == targetLang && fullPhrases[i].src == query) {
        return fullPhrases[i].tgt;
      }
    }

    // 2. Real-time token-by-token translation
    std::vector<std::string> tokens = splitTokens(query);
    std::string output = "";
    for (size_t i = 0; i < tokens.size(); ++i) {
      std::string translated = translateWord(tokens[i], targetLang);
      output += translated;
      if (i + 1 < tokens.size()) {
        output += " ";
      }
    }

    return output;
  }
};

int main(int argc, char *argv[]) {
#ifdef _WIN32
  SetConsoleOutputCP(CP_UTF8);
#endif

  UniversalEdgeTranslator engine;

  if (argc >= 3) {
    std::string query = argv[1];
    std::string lang = argv[2];
    std::cout << engine.translateSentence(query, lang);
    return 0;
  }

  return 0;
}