import { useMemo, useState } from 'react';
import { Pencil, Phone, Search, User } from 'lucide-react';
import { fmtBaht, useStore } from '../store';
import type { CupId, Team } from '../types';
import { CUP_LABEL, DEPOSIT_AMOUNT } from '../types';
import { CupTag, Field, Modal, PageHeader } from './ui-bits';

export default function Teams() {
  const { state, depositOf, fineOf } = useStore();
  const [cup, setCup] = useState<'all' | CupId>('all');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<Team | null>(null);

  const filtered = useMemo(() => state.teams.filter(t =>
    (cup === 'all' || t.cup === cup) && (!q || `${t.name} ${t.org}`.includes(q)),
  ), [state.teams, cup, q]);

  return (
    <div className="anim-fade-up">
      <PageHeader title="ทะเบียนทีม 39 ทีม (3 ถ้วย)" desc="ข้อมูลทีม สังกัด อปท. ผู้จัดการทีม และสถานะเงินประกันรายทีม" />

      <div className="card-soft mb-4 flex flex-wrap items-center gap-2 p-4 no-print">
        {(['all', 'kor', 'khor', 'u17'] as const).map(c => (
          <button key={c} onClick={() => setCup(c)}
            className={`btn !px-3 !py-1.5 text-xs ${cup === c ? 'bg-[#162638] text-[#fce1b6]' : 'bg-white border border-[#d9d2c0] text-[#6b6248]'}`}>
            {c === 'all' ? 'ทั้งหมด' : CUP_LABEL[c]}
          </button>
        ))}
        <div className="relative ml-auto min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a49a80]" />
          <input className="input !pl-9" placeholder="ค้นหาทีม / อปท...." value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(t => {
          const dep = depositOf(t.id);
          const fine = fineOf(t.id);
          const remaining = dep.amount - fine;
          return (
            <div key={t.id} className="card-soft group p-4 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl font-display text-sm font-bold text-white" style={{ background: t.color }}>
                    {t.slot}
                  </span>
                  <div>
                    <div className="font-display font-bold text-[#162638]">{t.name}</div>
                    <div className="text-xs text-[#8a8270]">{t.org} • สาย {t.group}</div>
                  </div>
                </div>
                <CupTag cup={t.cup} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#fbf9f3] p-2.5 text-center text-xs">
                <div>
                  <div className="text-[#8a8270]">ประกัน</div>
                  <div className={`font-display font-bold ${dep.status === 'paid' ? 'text-[#2e7d5b]' : dep.status === 'refunded' ? 'text-[#2a4560]' : 'text-[#b3372b]'}`}>
                    {dep.status === 'paid' ? 'ชำระแล้ว' : dep.status === 'refunded' ? 'คืนแล้ว' : 'ค้างชำระ'}
                  </div>
                </div>
                <div>
                  <div className="text-[#8a8270]">ค่าปรับ</div>
                  <div className={`font-display font-bold ${fine > 0 ? 'text-[#b3372b]' : 'text-[#6b6248]'}`}>{fmtBaht(fine)}</div>
                </div>
                <div>
                  <div className="text-[#8a8270]">ประกันคงเหลือ</div>
                  <div className="font-display font-bold text-[#162638]">{fmtBaht(Math.max(0, remaining))}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#8a8270]">
                <span className="inline-flex items-center gap-1 truncate"><User size={12} /> {t.manager ?? '—'}</span>
                <span className="inline-flex items-center gap-1"><Phone size={12} /> {t.phone ?? '—'}</span>
                <button className="btn-ghost !px-2.5 !py-1 text-xs no-print" onClick={() => setEdit(t)}><Pencil size={12} /> แก้ไข</button>
              </div>
            </div>
          );
        })}
      </div>

      <TeamEditModal team={edit} onClose={() => setEdit(null)} />
    </div>
  );
}

function TeamEditModal({ team, onClose }: { team: Team | null; onClose: () => void }) {
  const { update } = useStore();
  const [form, setForm] = useState<Partial<Team>>({});
  const [initFor, setInitFor] = useState('');
  if (team && initFor !== team.id) { setInitFor(team.id); setForm(team); }
  if (!team) return null;
  const set = (k: keyof Team, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={`แก้ไขข้อมูลทีม — ${team.name}`}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="ชื่อทีม"><input className="input" value={form.name ?? ''} onChange={e => set('name', e.target.value)} /></Field>
        <Field label="สังกัด อปท."><input className="input" value={form.org ?? ''} onChange={e => set('org', e.target.value)} /></Field>
        <Field label="ผู้จัดการทีม"><input className="input" value={form.manager ?? ''} onChange={e => set('manager', e.target.value)} /></Field>
        <Field label="เบอร์ติดต่อ"><input className="input" value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} /></Field>
        <Field label="สีเสื้อ"><input type="color" className="input h-10 !p-1" value={form.color ?? '#162638'} onChange={e => set('color', e.target.value)} /></Field>
        <div className="flex items-end pb-1 text-xs text-[#8a8270]">ถ้วย {CUP_LABEL[team.cup]} • สาย {team.group} • ลำดับ {team.slot} • ประกัน {fmtBaht(DEPOSIT_AMOUNT)}</div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>ยกเลิก</button>
        <button className="btn-gold" onClick={() => {
          update(s => ({ ...s, teams: s.teams.map(t => t.id === team.id ? { ...t, ...form } : t) }));
          onClose();
        })}>บันทึก</button>
      </div>
    </Modal>
  );
}
