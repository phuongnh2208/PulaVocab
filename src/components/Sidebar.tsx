import React from 'react';
import { Home, Book } from 'lucide-react';

type Tab = 'create' | 'collection';

interface SidebarProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function Sidebar({ activeTab, onChange }: SidebarProps) {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-white border-r-2 border-[#E5E5E5] p-4 gap-2">
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm">
          P
        </div>
        <span className="text-2xl font-black text-[#10B981] tracking-tighter">PulaVocab</span>
      </div>
      <button
        onClick={() => onChange('create')}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase tracking-wide transition-all ${
          activeTab === 'create' ? 'bg-[#DDF4FF] text-[#1899D6] border-2 border-[#84D8FF]' : 'hover:bg-[#F1F1F1]'
        }`}
      >
        <Home size={24} /> Học bài
      </button>
      <button
        onClick={() => onChange('collection')}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase tracking-wide transition-all ${
          activeTab === 'collection' ? 'bg-[#DDF4FF] text-[#1899D6] border-2 border-[#84D8FF]' : 'hover:bg-[#F1F1F1]'
        }`}
      >
        <Book size={24} /> Kho từ vựng
      </button>
    </nav>
  );
}
