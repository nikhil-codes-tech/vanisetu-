#include <algorithm>
#include <fstream>
#include <iostream>
#include <random>
#include <sstream>
#include <string>
#include <vector>

struct MultiLangPair {
  std::string hindi;
  std::string target;
  std::string lang;
};

std::string cleanField(std::string s) {
  while (!s.empty() && (s.back() == '\r' || s.back() == '\n' ||
                        s.back() == ' ' || s.back() == '\t')) {
    s.pop_back();
  }
  size_t start = 0;
  while (start < s.size() && (s[start] == ' ' || s[start] == '\t')) {
    start++;
  }
  s = s.substr(start);

  if (s.size() >= 2 && s.front() == '"' && s.back() == '"') {
    s = s.substr(1, s.size() - 2);
  }
  return s;
}

bool parseLine(const std::string &rawLine, MultiLangPair &pair) {
  if (rawLine.empty())
    return false;

  std::vector<std::string> fields;
  std::string current;
  bool inQuotes = false;

  for (char c : rawLine) {
    if (c == '"') {
      inQuotes = !inQuotes;
    } else if (c == ',' && !inQuotes) {
      fields.push_back(current);
      current.clear();
    } else {
      current += c;
    }
  }
  fields.push_back(current);

  if (fields.size() < 3)
    return false;

  pair.hindi = cleanField(fields[0]);
  pair.target = cleanField(fields[1]);
  pair.lang = cleanField(fields[2]);

  if (pair.hindi == "hindi" && pair.target == "target")
    return false;

  return (!pair.hindi.empty() && !pair.target.empty() && !pair.lang.empty());
}

int main() {
  const std::string inputFile = "src/data/train.csv";
  std::ifstream file(inputFile);

  if (!file.is_open()) {
    std::cerr << "Could not open " << inputFile << "\n";
    return 1;
  }

  std::vector<MultiLangPair> dataset;
  std::string line;

  while (std::getline(file, line)) {
    MultiLangPair pair;
    if (parseLine(line, pair)) {
      dataset.push_back(pair);
    }
  }
  file.close();

  std::mt19937 rng(42);
  std::shuffle(dataset.begin(), dataset.end(), rng);

  size_t trainSize = static_cast<size_t>(dataset.size() * 0.85);

  std::ofstream trainOut("src/data/train_split.jsonl");
  for (size_t i = 0; i < trainSize; ++i) {
    trainOut << "{\"src\":\"" << dataset[i].hindi << "\",\"tgt\":\""
             << dataset[i].target << "\",\"lang\":\"" << dataset[i].lang
             << "\"}\n";
  }

  std::ofstream valOut("src/data/val_split.jsonl");
  for (size_t i = trainSize; i < dataset.size(); ++i) {
    valOut << "{\"src\":\"" << dataset[i].hindi << "\",\"tgt\":\""
           << dataset[i].target << "\",\"lang\":\"" << dataset[i].lang
           << "\"}\n";
  }

  std::cout << "Trilingual dataset processed:\n";
  std::cout << "- Total pairs: " << dataset.size() << "\n";
  std::cout << "- Training split: " << trainSize << "\n";
  std::cout << "- Validation split: " << (dataset.size() - trainSize) << "\n";

  return 0;
}