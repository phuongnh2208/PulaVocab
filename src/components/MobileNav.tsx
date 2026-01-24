import React from 'react';
import { Home, Book } from 'lucide-react';

type Tab = 'create' | 'collection';

interface MobileNavProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function MobileNav({ activeTab, onChange }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#E5E5E5] flex justify-around p-3 z-50">
      <button
        onClick={() => onChange('create')}
        className={`p-3 rounded-xl ${activeTab === 'create' ? 'text-[#1899D6]' : 'text-[#AFAFAF]'}`}
      >
        <Home size={28} />
      </button>
      <button
        onClick={() => onChange('collection')}
        className={`p-3 rounded-xl ${activeTab === 'collection' ? 'text-[#1899D6]' : 'text-[#AFAFAF]'}`}
      >
        <Book size={28} />
      </button>
    </nav>
  );
}
