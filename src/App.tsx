import React, { useState, useEffect } from 'react';
import { Zap, Volume2, Trash2, Sparkles, BookOpen, BrainCircuit, Loader2, Cloud } from 'lucide-react';
import Button from './components/Button';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import ResultCard from './components/ResultCard';
import FirebaseStatus from './components/FirebaseStatus';
import UserMenu from './components/UserMenu';
import {
  isFirebaseReady,
  saveCardCloud,
  listCardsCloud,
  deleteCardCloud,
  signInWithGoogle,
  signOutFirebase,
  onAuthChanged,
  checkRedirectResult,
  type CloudUser,
} from './lib/firebase';

// --- Cấu hình API Gemini ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const model = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash-preview-09-2025';
const isApiConfigured = apiKey.trim().length > 0;

// --- Types ---
type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'pronoun'
  | 'determiner'
  | 'conjunction'
  | 'other';

interface GrammarPart {
  text: string;
  type: PartOfSpeech;
  explanation: string;
}

interface GeneratedCard {
  id: string;
  inputWords: string[];
  sentence: string;
  translation: string;
  grammarAnalysis: GrammarPart[];
  timestamp: number;
  level: Level;
  cloud?: boolean;
}

type Level = 'A1' | 'A2' | 'B1' | 'B2';

// --- AI Engine with Gemini ---
const generateWithGemini = async (words: string[], level: Level): Promise<GeneratedCard> => {
  const prompt = `
    You are an expert English teacher. 
    User input keywords: ${words.join(', ')}.
    Target CEFR level: ${level}.
    Task:
    1. Create a natural, meaningful English sentence using ALL these keywords.
    2. Translate it to Vietnamese naturally.
    3. Break down the sentence into key grammar components.

    Guidance by level:
    - A1/A2: Use simple vocabulary and basic grammar structures.
    - B1/B2: Use richer vocabulary and more complex, but still clear, structures.
    
    Return ONLY a JSON object in this format:
    {
      "sentence": "string",
      "translation": "string",
      "grammarAnalysis": [
        {"text": "word/phrase", "type": "noun|verb|adjective|adverb|preposition|pronoun|determiner|conjunction|other", "explanation": "Vietnamese explanation"}
      ]
    }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) throw new Error('AI Service Error');

    const result = await response.json();
    const data = JSON.parse(result.candidates[0].content.parts[0].text);

    return {
      id: Date.now().toString(),
      inputWords: words,
      ...data,
      timestamp: Date.now(),
      level,
    };
  } catch (error) {
    console.error('Gemini Error:', error);
    // Fallback nếu API lỗi
    return {
      id: Date.now().toString(),
      inputWords: words,
      sentence: `I am using ${words.join(' and ')} to learn English.`,
      translation: `Tôi đang sử dụng ${words.join(' và ')} để học tiếng Anh.`,
      grammarAnalysis: words.map((w) => ({ text: w, type: 'other', explanation: 'Từ vựng' })),
      timestamp: Date.now(),
      level,
    };
  }
};

// --- UI Components ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'collection'>('create');
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedCard | null>(null);
  const [savedCards, setSavedCards] = useState<GeneratedCard[]>([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState<Level>('A1');
  const [notice, setNotice] = useState<null | { type: 'success' | 'error'; text: string }>(null);
  const [cloudUser, setCloudUser] = useState<CloudUser | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('duo_vocab_ai');
    if (data) setSavedCards(JSON.parse(data));
    if (isFirebaseReady) {
      // Check for redirect result first
      checkRedirectResult().then((user) => {
        if (user) {
          setCloudUser(user);
          setNotice({ type: 'success', text: 'Đăng nhập thành công!' });
          setTimeout(() => setNotice(null), 2000);
          // Load data from Firebase after login
          loadCloudData(user.uid);
        }
      });
      
      // Set up auth state listener
      const unsub = onAuthChanged((u) => {
        setCloudUser(u);
        // When user logs in, load their cloud data
        if (u) {
          loadCloudData(u.uid);
        }
      });
      return () => {
        if (typeof unsub === 'function') unsub();
      };
    }
  }, []);

  // Function to load data from Firebase
  const loadCloudData = async (uid: string) => {
    if (!isFirebaseReady) return;
    try {
      const cloudCards = await listCardsCloud(uid);
      if (cloudCards.length > 0) {
        const mapped = cloudCards.map((c) => ({ ...c, cloud: true })) as GeneratedCard[];
        setSavedCards(mapped);
        localStorage.setItem('duo_vocab_ai', JSON.stringify(mapped));
        setNotice({ type: 'success', text: `Đã tải ${cloudCards.length} từ vựng từ đám mây` });
        setTimeout(() => setNotice(null), 3000);
      }
    } catch (error) {
      console.error('Error loading cloud data:', error);
      // Don't show error if it's just empty data
    }
  };

  const handleGenerate = async () => {
    if (!inputVal.trim()) return;
    setLoading(true);
    const words = inputVal.split(',').map((w) => w.trim());
    const card = await generateWithGemini(words, level);
    setResult(card);
    setLoading(false);
  };

  const saveCard = () => {
    if (result) {
      const doSave = async () => {
        let cloudFlag = false;
        let cloudErrorCode: string | null = null;
        let cloudErrorMessage: string | null = null;
        
        if (isFirebaseReady && cloudUser) {
          try {
            await saveCardCloud(result, cloudUser.uid);
            cloudFlag = true;
            console.log('✅ Card saved to Firebase successfully:', result.id);
          } catch (e) {
            cloudFlag = false;
            const error = e as any;
            console.error('❌ Error saving to Firebase:', error);
            if (error?.message === 'firebase-not-ready') {
              cloudErrorCode = 'firebase-not-configured';
            } else {
              cloudErrorCode = error?.code || error?.message || 'unknown-error';
              cloudErrorMessage = error?.message || '';
            }
          }
        } else if (isFirebaseReady && !cloudUser) {
          setNotice({ type: 'error', text: 'Vui lòng đăng nhập để lưu đám mây' });
          setTimeout(() => setNotice(null), 2500);
          return; // Don't save locally if user wants cloud save but not logged in
        }
        
        const saved = { ...result, cloud: cloudFlag } as GeneratedCard;
        const newCards = [saved, ...savedCards];
        setSavedCards(newCards);
        localStorage.setItem('duo_vocab_ai', JSON.stringify(newCards));
        
        // Show appropriate message
        if (cloudFlag) {
          setNotice({ type: 'success', text: '✅ Đã lưu lên Firebase! Dữ liệu sẽ được đồng bộ trên mọi thiết bị.' });
          setTimeout(() => setNotice(null), 4000);
        } else if (isFirebaseReady && cloudUser) {
          // User is logged in but save failed
          let errorMsg = 'Không thể lưu lên Firebase';
          if (cloudErrorCode === 'firebase-not-configured') {
            errorMsg = 'Firebase chưa được cấu hình đúng. Kiểm tra file .env.local và khởi động lại server.';
          } else if (cloudErrorCode === 'permission-denied') {
            errorMsg = 'Không có quyền lưu. Kiểm tra Firestore Rules trong Firebase Console.';
          } else if (cloudErrorCode) {
            errorMsg = `Không thể lưu lên Firebase (${cloudErrorCode}). ${cloudErrorMessage || 'Kiểm tra Firestore đã bật và rules cho phép người dùng hiện tại.'}`;
          } else {
            errorMsg = 'Không thể lưu lên Firebase. Kiểm tra Firestore đã bật và rules cho phép người dùng hiện tại.';
          }
          setNotice({ type: 'error', text: errorMsg });
          setTimeout(() => setNotice(null), 5000);
        } else if (!isFirebaseReady) {
          setNotice({ type: 'error', text: 'Firebase chưa cấu hình. Tạo file .env.local với các biến VITE_FIREBASE_*' });
          setTimeout(() => setNotice(null), 3000);
        } else {
          // Not logged in, saved locally only
          setNotice({ type: 'success', text: 'Đã lưu vào bộ nhớ cục bộ. Đăng nhập để lưu đám mây.' });
          setTimeout(() => setNotice(null), 3000);
        }
        
        setXp((prev) => prev + 20);
        setResult(null);
        setInputVal('');
        setActiveTab('collection');
      };
      void doSave();
    }
  };

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#4B4B4B] font-sans pb-20 md:pb-0 md:flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto p-4 md:p-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black text-[#3C3C3C]">
            {activeTab === 'create' ? 'Tạo câu với AI' : 'Thư viện của bạn'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border-2 border-[#E5E5E5] px-4 py-1.5 rounded-2xl shadow-sm">
              <Zap className="text-[#FFC800] fill-[#FFC800]" size={20} />
              <span className="font-bold text-[#FFC800]">{xp} XP</span>
            </div>
            {activeTab === 'collection' && (
              <button
                onClick={async () => {
                  if (!isFirebaseReady || !cloudUser) return;
                  try {
                    const cloudCards = await listCardsCloud(cloudUser.uid);
                    const mapped = (cloudCards as any[]).map((c) => ({ ...c, cloud: true }));
                    setSavedCards(mapped as any);
                    localStorage.setItem('duo_vocab_ai', JSON.stringify(mapped));
                    setNotice({ type: 'success', text: 'Đã đồng bộ từ Firebase' });
                    setTimeout(() => setNotice(null), 2000);
                  } catch (e) {
                    const error = e as any;
                    const errorMsg = error?.message === 'firebase-not-ready'
                      ? 'Firebase chưa được cấu hình'
                      : error?.code || error?.message || 'Lỗi không xác định';
                    setNotice({ type: 'error', text: `Không thể đồng bộ: ${errorMsg}` });
                    setTimeout(() => setNotice(null), 3000);
                  }
                }}
                disabled={!isFirebaseReady || !cloudUser}
                className={`ml-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E5E5] ${
                  isFirebaseReady && cloudUser
                    ? 'text-[#2563EB] hover:bg-[#E1F0FF]'
                    : 'text-[#AFAFAF] cursor-not-allowed'
                }`}
              >
                <Cloud size={18} /> Đồng bộ
              </button>
            )}
            {isFirebaseReady && (
              <UserMenu
                user={cloudUser}
                onLogin={async () => {
                  try {
                    const user = await signInWithGoogle();
                    if (user) {
                      setNotice({ type: 'success', text: 'Đăng nhập thành công!' });
                      setTimeout(() => setNotice(null), 2000);
                    } else {
                      setNotice({ type: 'success', text: 'Đang chuyển hướng đến Google để đăng nhập...' });
                    }
                  } catch (e) {
                    const error = e as any;
                    const code = error?.code || error?.message || 'unknown-error';
                    const msgMap: Record<string, string> = {
                      'auth/unauthorized-domain': 'Tên miền chưa được phép trong Firebase Authentication → Authorized domains. Thêm localhost và 127.0.0.1.',
                      'auth/invalid-api-key': 'API key không hợp lệ hoặc bị hạn chế referrer. Kiểm tra VITE_FIREBASE_API_KEY trong .env.local',
                      'auth/operation-not-allowed': 'Google provider chưa được bật trong Firebase Authentication.',
                      'auth/configuration-not-found': 'Cấu hình Firebase Authentication không tìm thấy. Bật Google Sign-in và kiểm tra .env.local khớp với dự án.',
                      'auth/popup-blocked': 'Trình duyệt chặn popup. Sẽ dùng redirect.',
                      'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập.',
                      'firebase-not-ready': 'Firebase chưa được cấu hình. Kiểm tra file .env.local',
                    };
                    setNotice({ type: 'error', text: `Đăng nhập Google thất bại (${code}). ${msgMap[code] || 'Kiểm tra Console (F12) để xem lỗi chi tiết.'}` });
                    setTimeout(() => setNotice(null), 5000);
                    console.error('Login error:', error);
                  }
                }}
                onLogout={() => signOutFirebase()}
              />
            )}
          </div>
        </div>
        {/* Auth controls moved to header */}
        {notice && (
          <div
            className={`mb-6 text-sm px-4 py-2 rounded-xl border ${
              notice.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {notice.text}
          </div>
        )}

        {activeTab === 'create' ? (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left column: input + controls */}
            <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-black text-[#AFAFAF] uppercase tracking-widest mb-4">
                Nhập từ vựng (phân cách bằng dấu phẩy)
              </p>
              {/* Level selector */}
              <div className="mb-3 flex flex-wrap gap-2">
                {(['A1', 'A2', 'B1', 'B2'] as Level[]).map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setLevel(lv)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      level === lv
                        ? 'bg-[#DDF4FF] text-[#1899D6] border-[#84D8FF]'
                        : 'bg-white text-[#777] border-[#E5E5E5] hover:bg-[#F7F7F7]'
                    }`}
                    aria-pressed={level === lv}
                  >
                    {lv}
                  </button>
                ))}
              </div>
              {!isApiConfigured && (
                <div className="mb-3 text-xs text-[#7A7A7A] bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                  Chưa cấu hình API Key Gemini. Ứng dụng sẽ dùng chế độ dự phòng tạo câu cơ bản.
                  Hãy tạo file <span className="font-bold">.env.local</span> và thiết lập <span className="font-mono">VITE_GEMINI_API_KEY</span> để bật AI.
                </div>
              )}
              <div className="relative group">
                <input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="reach for, a lamp, table..."
                  className="w-full text-xl font-bold p-4 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-2xl focus:outline-none focus:border-[#1CB0F6] transition-all"
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFC800] opacity-50 group-focus-within:opacity-100" />
              </div>
              <Button onClick={handleGenerate} disabled={loading || !inputVal} fullWidth className="mt-6">
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <BrainCircuit size={20} /> AI Tạo Câu Thông Minh
                  </>
                )}
              </Button>
            </div>

            {/* Right column: result card or placeholder */}
            <div>
              {result ? (
                <ResultCard result={result} onCancel={() => setResult(null)} onSave={saveCard} onSpeak={speak} />
              ) : (
                <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-sm text-center text-[#777]">
                  Nhập từ và bấm “AI Tạo Câu Thông Minh” để xem kết quả tại đây.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedCards.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                <BookOpen size={64} className="mx-auto mb-4" />
                <p className="font-bold">Chưa có từ vựng nào được lưu.</p>
              </div>
            ) : (
              savedCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 flex justify-between items-center group"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => speak(card.sentence)}
                      className="p-3 bg-[#1CB0F6] text-white rounded-xl shadow-sm active:translate-y-1 transition-all"
                    >
                      <Volume2 size={20} />
                    </button>
                    {card.cloud && (
                      <span className="flex items-center gap-1 text-[#1CB0F6] text-xs font-bold">
                        <Cloud size={14} /> Đám mây
                      </span>
                    )}
                    <div
                      className="cursor-pointer hover:bg-[#F7F7F7] px-2 py-1 rounded-lg"
                      onClick={() => {
                        setResult(card);
                        setActiveTab('create');
                      }}
                    >
                      <h4 className="font-bold text-[#3C3C3C]">{card.sentence}</h4>
                      <p className="text-sm text-[#777]">{card.translation}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      const filtered = savedCards.filter((c) => c.id !== card.id);
                      setSavedCards(filtered);
                      localStorage.setItem('duo_vocab_ai', JSON.stringify(filtered));
                      if (isFirebaseReady && cloudUser) {
                        await deleteCardCloud(card.id, cloudUser.uid);
                      }
                    }}
                    className="p-2 text-[#AFAFAF] hover:text-[#FF4B4B] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <MobileNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
