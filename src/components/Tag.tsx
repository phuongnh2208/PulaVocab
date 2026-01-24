import React from 'react';

interface TagProps {
  type: string;
}

export default function Tag({ type }: TagProps) {
  const colors: Record<string, string> = {
    noun: 'bg-blue-100 text-blue-600',
    verb: 'bg-red-100 text-red-600',
    adjective: 'bg-green-100 text-green-600',
    adverb: 'bg-purple-100 text-purple-600',
    other: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${colors[type] || colors.other}`}>
      {type}
    </span>
  );
}
