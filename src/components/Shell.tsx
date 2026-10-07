import React, { useState } from 'react';
import {
  CalendarRange, FileText, Home, Landmark, LayoutDashboard, Menu, ShieldAlert, Trophy, Users, Wallet, X,
} from 'lucide-react';
import { EVENT_INFO } from '../data/seed';

export type ViewKey =
  | 'dashboard' | 'schedule' | 'standings' | 'teams'
  | 'finance-deposit' | 'finance-fine' | 'finance-sponsor' | 'documents';

const NAV: { key: ViewKey; label: string; icon: React.ElementType; group: string }[] = [
  { key: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard, group: 'ภาพรวม' },
  { key: 'schedule', label: 'โปรแกรม 68 นัด', icon: CalendarRange, group: 'การแข่งขัน' },
  { key: 'standings', label: 'ตารางคะแนน', icon: Trophy, group: 'การแข่งขัน' },
  { key: 'teams', label: 'ทีม 39 ทีม', icon: Users, group: 'การแข่งขัน' },
  { key: 'finance-deposit', label: 'เงินประกันทีม', icon: Wallet, group: 'การเงิน' },
  { key: 'finance-fine', label: 'ค่าปรับ & วินัย', icon: ShieldAlert, group: 'การเงิน' },
  { key: 'finance-sponsor', label: 'สปอนเซอร์', icon: Landmark, group: 'การเงิน' },
  { key: 'documents', label: 'เอกสาร 4 หมวด', icon: FileText, group: 'เอกสาร' },
];

const GROUP_ORDER = ['ภาพรวม', 'การแข่งขัน', 'การเงิน', 'เอกสาร'];

export default function Shell({ view, setView, onHome, children }: {
  view: ViewKey; setView: (v: ViewKey) => void; onHome: () => void; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex h-full flex-col">
      <button onClick={onHome} className="flex items-center gap-3 border-b border-white/10 px-5 py-5 text-left hover:bg-white/5">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d9bd85] to-[#af915f] text-[#101d2e]">
          <Trophy size={20} />
        </span>
        <span>
          <span className="block font-display text-sm font-bold text-[#fce1b6]">ลอยกระทงคัพ 54</span>
          <span className="block text-[11px] text-white/50">{EVENT_INFO.version} • พ.ศ. 2569</span>
        </span>
      </button>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {GROUP_ORDER.map(g => (
          <div key={g} className="mb-4">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#af915f]">{g}</div>
            {NAV.filter(n => n.group === g).map(n => {
              const active = view === n.key;
              return (
                <button key={n.key} onClick={() => { setView(n.key); setOpen(false); }}
                  className={`mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    active ? 'bg-gradient-to-r from-[#c6a76e] to-[#af915f] font-bold text-[#101d2e] shadow'
                           : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                  <n.icon size={17} />
                  {n.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={onHome} className="mx-3 mb-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-white/60 hover:bg-white/5 hover:text-white">
        <Home size={14} /> กลับหน้าปก
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#f7f4ec]">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 bg-[#101d2e] lg:block">{nav}</aside>
      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#101d2e] shadow-2xl">{nav}</aside>
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white" onClick={() => setOpen(false)} aria-label="ปิดเมนู">
            <X size={18} />
          </button>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e6dfcd] bg-[#f7f4ec]/90 px-4 py-3 backdrop-blur no-print lg:px-8">
          <button className="rounded-xl border border-[#d9d2c0] bg-white p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="เปิดเมนู">
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-bold text-[#162638]">{EVENT_INFO.title} • {EVENT_INFO.year}</div>
            <div className="truncate text-[11px] text-[#8a8270]">{EVENT_INFO.host}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="chip hidden bg-[#2e7d5b]/10 text-[#2e7d5b] sm:inline-flex">ระบบพร้อมใช้งาน</span>
            <span className="chip bg-[#162638] text-[#fce1b6]">{EVENT_INFO.version}</span>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
