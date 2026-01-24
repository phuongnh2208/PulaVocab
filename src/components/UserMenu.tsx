import React, { useState, useRef, useEffect } from 'react';

interface UserLike {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

interface UserMenuProps {
  user: UserLike | null;
  onLogin: () => Promise<void> | void;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogin, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => onLogin()}
        className="px-3 py-1.5 rounded-2xl bg-[#2563EB] text-white font-bold border-b-4 border-[#1D4ED8] hover:bg-[#2B6DEB]"
      >
        Đăng nhập Google
      </button>
    );
  }

  const name = user.displayName || user.email || 'Người dùng';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white border-2 border-[#E5E5E5] px-3 py-1.5 rounded-2xl shadow-sm"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={name} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 bg-[#10B981] text-white rounded-full flex items-center justify-center text-xs font-bold">
            {initial}
          </div>
        )}
        <span className="text-sm font-bold text-[#3C3C3C] truncate max-w-[140px]">{name}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E5E5] rounded-xl shadow-lg p-2">
          <div className="px-2 py-1 text-xs text-[#6B7280]">Tài khoản</div>
          <div className="px-2 py-2 text-sm font-bold text-[#111827] truncate">{name}</div>
          <button
            className="w-full text-left px-2 py-2 text-sm rounded-lg hover:bg-[#F3F4F6]"
            onClick={onLogout}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
