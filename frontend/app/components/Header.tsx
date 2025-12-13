'use client';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[var(--border)] z-20 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">HawkAI</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 rounded-full bg-gray-100 text-[var(--text-primary)] hover:bg-gray-200 transition-colors text-sm font-medium">
          Profile
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
          <span className="text-sm font-semibold text-[var(--text-primary)]">U</span>
        </button>
      </div>
    </header>
  );
}
