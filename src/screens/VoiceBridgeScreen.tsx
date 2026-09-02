import React, { useState } from 'react';
import { OnnxTranslatorService, TranslationResult } from '../services/onnxTranslator';
import { PiperTtsService } from '../services/piperTts';
import { WhisperAsrService } from '../services/whisperAsr';
import { SupportedLanguage } from '../types/models';

interface VoiceBridgeScreenProps {
  currentLanguage: SupportedLanguage;
}

export const VoiceBridgeScreen: React.FC<VoiceBridgeScreenProps> = ({ currentLanguage }) => {
  const [inputText, setInputText] = useState('नमस्ते, आज हम जंगल और नदियों के बारे में पढ़ेंगे।');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1.0>(1.0);

  const handleTranslate = async (textToTranslate?: string) => {
    const text = textToTranslate || inputText;
    if (!text.trim()) return;
    setIsTranslating(true);
    const res = await OnnxTranslatorService.translate(text, currentLanguage);
    setTranslation(res);
    setIsTranslating(false);
  };

  const handleMicToggle = async () => {
    if (!isRecording) {
      setIsRecording(true);
      await WhisperAsrService.startListening(partial => {
        setInputText(partial);
      });
    } else {
      setIsRecording(false);
      const res = await WhisperAsrService.stopListening();
      setInputText(res.text);
      handleTranslate(res.text);
    }
  };

  const handleSpeakOutput = () => {
    if (translation) {
      PiperTtsService.speak(translation.translatedText, { speed: playbackSpeed });
    }
  };

  const samplePrompts = [
    'नमस्ते, सब बच्चे बैठ जाएँ।',
    'कृपया अपनी किताब का पृष्ठ 5 खोलें।',
    'पानी पीने के लिए बाहर जाएँ।',
    'आज हम एक सुंदर कविता गाएंगे।',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-[#312E81]">🎙️ लाइव ध्वनि सेतु (Live Voice Bridge &amp; AI Translation)</h2>
          <p className="text-xs text-gray-500">Whisper.cpp (Speech-to-Text) + ONNX Runtime (Translation) + Piper TTS</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">ध्वनि गति (Speed):</span>
          <button
            onClick={() => setPlaybackSpeed(0.75)}
            className={`px-2.5 py-1 rounded text-xs font-black transition-all ${
              playbackSpeed === 0.75 ? 'bg-[#312E81] text-white shadow' : 'bg-gray-100 text-gray-700'
            }`}
          >
            0.75x (धीमी)
          </button>
          <button
            onClick={() => setPlaybackSpeed(1.0)}
            className={`px-2.5 py-1 rounded text-xs font-black transition-all ${
              playbackSpeed === 1.0 ? 'bg-[#312E81] text-white shadow' : 'bg-gray-100 text-gray-700'
            }`}
          >
            1.0x (सामान्य)
          </button>
        </div>
      </div>

      {/* Main Dual Translation Console */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Input Box (Hindi) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-black text-xs text-gray-700 uppercase tracking-wider">
                1. शिक्षक की आवाज़ / इनपुट (Hindi)
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                Whisper.cpp Tiny Q5_1
              </span>
            </div>

            <textarea
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="यहाँ हिंदी वाक्य लिखें या माइक दबाकर बोलें..."
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-xl p-3 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#312E81] focus:outline-none"
            />

            {/* Quick Prompts */}
            <div className="mt-3">
              <span className="text-[10px] font-bold text-gray-400 block mb-1.5">कक्षा के त्वरित वाक्य (Quick Prompts):</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setInputText(p);
                      handleTranslate(p);
                    }}
                    className="bg-[#F1F5F9] hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px] font-bold"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleMicToggle}
              className={`flex-1 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-[#312E81] hover:bg-[#282568] text-white'
              }`}
            >
              <span>{isRecording ? '⏹️ बोलना बंद करें (Stop)' : '🎙️ माइक दबाएं व बोलें (Speak)'}</span>
            </button>
            <button
              onClick={() => handleTranslate()}
              disabled={isTranslating}
              className="bg-[#0F4D2A] hover:bg-[#14532D] text-white px-4 py-3 rounded-xl font-black text-xs shadow-md transition-all"
            >
              {isTranslating ? 'अनुवाद हो रहा है...' : '➔ अनुवाद करें'}
            </button>
          </div>
        </div>

        {/* Target Output Box (Tribal Dialect) */}
        <div className="bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] rounded-2xl p-5 border border-[#A5B4FC] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-black text-xs text-[#312E81] uppercase tracking-wider">
                2. मातृभाषा अनुवाद व उच्चारण ({currentLanguage.toUpperCase()})
              </span>
              <span className="bg-[#C7D2FE] text-[#312E81] text-[10px] font-bold px-2 py-0.5 rounded">
                ONNX Neural Engine
              </span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#C7D2FE] min-h-[110px]">
              {translation ? (
                <div>
                  <div className="font-black text-lg text-[#312E81] mb-1">
                    {translation.translatedText}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mb-2">
                    ध्वन्यात्मक उच्चारण: <b className="text-gray-800 font-mono">{translation.phoneticSpelling}</b>
                  </div>
                  <div className="text-xs text-[#E06D10] font-bold">
                    लिपि (Script): <span className="font-mono text-sm">{translation.scriptOutput}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-xs font-semibold flex items-center justify-center h-20 text-center">
                  अनुवाद देखने के लिए बाएं बॉक्स में वाक्य दर्ज करें या माइक दबाएं
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSpeakOutput}
              disabled={!translation}
              className="w-full bg-[#312E81] hover:bg-[#282568] disabled:opacity-50 text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>🔊 Piper TTS से बच्चों को सुनाएँ (Voice Playback)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
