import React from 'react';
import { BookOpen, Volume2, Check } from 'lucide-react';
import Button from './Button';
import Tag from './Tag';

interface GrammarPart {
  text: string;
  type: string;
  explanation: string;
}

interface ResultCardProps {
  result: {
    sentence: string;
    translation: string;
    grammarAnalysis: GrammarPart[];
    level: string;
  };
  onCancel: () => void;
  onSave: () => void;
  onSpeak: (text: string) => void;
}

export default function ResultCard({ result, onCancel, onSave, onSpeak }: ResultCardProps) {
  return (
    <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl overflow-hidden shadow-md animate-in slide-in-from-bottom-4">
      <div className="p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#58CC02] rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <BookOpen size={24} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#3C3C3C]">{result.sentence}</h2>
              <button
                onClick={() => onSpeak(result.sentence)}
                className="p-2 text-[#1CB0F6] hover:bg-[#E1F5FE] rounded-full transition-colors"
              >
                <Volume2 size={24} />
              </button>
            </div>
            <p className="text-lg text-[#777] italic">"{result.translation}"</p>
            <p className="text-xs text-[#7A7A7A]">Trình độ: {result.level}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-widest">Phân tích ngữ pháp</p>
          <div className="grid gap-2">
            {result.grammarAnalysis.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-[#4B4B4B]">{item.text}</span>
                  <span className="text-xs text-[#777]">{item.explanation}</span>
                </div>
                <Tag type={item.type} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#F7F7F7] p-4 border-t-2 border-[#E5E5E5] flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button variant="action" onClick={onSave}>
          <Check size={20} /> Lưu vào kho
        </Button>
      </div>
    </div>
  );
}
