import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, wide }: {
  open: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-[#0b1522]/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#f7f4ec] shadow-2xl anim-fade-up`}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-3xl bg-[#162638] px-5 py-4 text-white">
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white" aria-label="ปิด">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-[#6b6248]">{label}</span>
      {children}
    </label>
  );
}

export function StatCard({ label, value, sub, tone = 'navy' }: {
  label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'navy' | 'gold' | 'green' | 'red';
}) {
  const tones = {
    navy: 'bg-[#162638] text-white',
    gold: 'bg-gradient-to-br from-[#d9bd85] to-[#af915f] text-[#101d2e]',
    green: 'bg-gradient-to-br from-[#2e7d5b] to-[#1d5c42] text-white',
    red: 'bg-gradient-to-br from-[#b3372b] to-[#7e241a] text-white',
  } as const;
  return (
    <div className={`rounded-2xl p-4 shadow-sm ${tones[tone]}`}>
      <div className="text-xs font-semibold opacity-75">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold leading-none">{value}</div>
      {sub && <div className="mt-1.5 text-xs opacity-80">{sub}</div>}
    </div>
  );
}

export function PageHeader({ title, desc, actions }: { title: string; desc?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#162638]">{title}</h1>
        {desc && <p className="mt-0.5 text-sm text-[#7a7260]">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 no-print">{actions}</div>}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfc7b0] bg-white/50 px-4 py-10 text-center text-sm text-[#8a8270]">
      {text}
    </div>
  );
}

export function CupTag({ cup }: { cup: 'kor' | 'khor' | 'u17' }) {
  const map = {
    kor: 'bg-[#162638] text-[#fce1b6]',
    khor: 'bg-[#af915f] text-white',
    u17: 'bg-[#2e7d5b] text-white',
  } as const;
  const label = { kor: 'ถ้วย ก', khor: 'ถ้วย ข', u17: 'U17' } as const;
  return <span className={`chip ${map[cup]}`}>{label[cup]}</span>;
}
