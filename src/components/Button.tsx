import React from 'react';

export type ButtonVariant = 'primary' | 'action' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const baseStyle =
    'font-bold uppercase tracking-wider py-3 px-6 rounded-2xl transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50 select-none flex items-center justify-center gap-2';
  const variants: Record<string, string> = {
    primary: 'bg-[#10B981] text-white border-b-4 border-[#0E9F6E] hover:bg-[#11C58A]',
    action: 'bg-[#2563EB] text-white border-b-4 border-[#1D4ED8] hover:bg-[#2B6DEB]',
    ghost: 'text-[#64748B] hover:bg-gray-100 border-none',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
