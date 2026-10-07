import { useMemo, useState } from 'react';
import { Pencil, Plus, Printer, RotateCcw, Search, Trophy } from 'lucide-react';
import { uid, useStore } from '../store';
import type { CupId, GoalEvent, Match, RoundId } from '../types';
import { CUP_LABEL, ROUND_LABEL, VENUES } from '../types';
import { CupTag, EmptyState, Field, Modal, PageHeader } from './ui-bits';

const ROUND_ORDER: RoundId[] = ['group', 'playoff', 'round2', 'semi', 'final'];

export default function Schedule() {
  const { state, update } = useStore();
  const [cup, setCup] = useState<'all' | CupId>('all');
  const [round, setRound] = useState<'all' | RoundId>('all');
  const [teamId, setTeamId] = useState('all');
  const [q, setQ] = useState('');
  const [resultFor, setResultFor] = useState<Match | null>(null);
  const [editFor, setEditFor] = useState<Match | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => state.matches.filter(m => {
    if (cup !== 'all' && m.cup !== cup) return false;
    if (round !== 'all' && m.round !== round) return false;
    if (teamId !== 'all' && m.homeId !== teamId && m.awayId !== teamId) return false;
    if (q) {
      const home = state.teams.find(t => t.id === m.homeId)?.name ?? m.homeLabel;
      const away = state.teams.find(t => t.id === m.awayId)?.name ?? m.awayLabel;
      const hay = `${home} ${away} ${m.date} ${m.venue} ${m.no}`;
      if (!hay.includes(q)) return false;
    }
    return true;
  }), [state.matches, state.teams, cup, round, teamId, q]);

  const nameOf = (id: string | null, fallback: string) =>
    id ? (state.teams.find(t => t.id === id)?.name ?? fallback) : fallback;

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="โปรแกรมการแข่งขัน 68 นัด"
        desc="22 ต.ค. – 24 พ.ย. 2569 • 2 สนาม • แข่ง 40+40 นาที พัก 10 นาที"
        actions={
          <>
            <button className="btn-ghost" onClick={() => window.print()}><Printer size={15} /> พิมพ์โปรแกรม</button>
            <button className="btn-navy" onClick={() => setAdding(true)}><Plus size={15} /> เพิ่มนัด</button>
          </>
        }
      />

      {/* filters */}
      <div className="card-soft mb-4 space-y-3 p-4 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#6b6248]">ถ้วย:</span>
          {(['all', 'kor', 'khor', 'u17'] as const).map(c => (
            <button key={c} onClick={() => setCup(c)}
              className={`btn !px-3 !py-1.5 text-xs ${cup === c ? 'bg-[#162638] text-[#fce1b6]' : 'bg-white border border-[#d9d2c0] text-[#6b6248]'}`}>
              {c === 'all' ? 'ทั้งหมด' : CUP_LABEL[c]}
            </button>
          ))}
          <span className="ml-2 text-xs font-bold text-[#6b6248]">รอบ:</span>
          {(['all', ...ROUND_ORDER] as const).map(r => (
            <button key={r} onClick={() => setRound(r)}
              className={`btn !px-3 !py-1.5 text-xs ${round === r ? 'bg-[#af915f] text-white' : 'bg-white border border-[#d9d2c0] text-[#6b6248]'}`}>
              {r === 'all' ? 'ทุกรอบ' : ROUND_LABEL[r]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a49a80]" />
            <input className="input !pl-9" placeholder="ค้นหาทีม / สนาม / วันที่..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select className="input max-w-56" value={teamId} onChange={e => setTeamId(e.target.value)}>
            <option value="all">— ทุกทีม (39 ทีม) —</option>
            {state.teams.map(t => <option key={t.id} value={t.id}>{CUP_LABEL[t.cup]}: {t.name}</option>)}
          </select>
          <button className="btn-ghost !py-2 text-xs" onClick={() => { setCup('all'); setRound('all'); setTeamId('all'); setQ(''); }}>
            <RotateCcw size={13} /> ล้างตัวกรอง
          </button>
          <span className="ml-auto text-xs text-[#8a8270]">แสดง {filtered.length} จาก 68 นัด</span>
        </div>
      </div>

      {/* table */}
      {filtered.length === 0 ? <EmptyState text="ไม่พบนัดที่ตรงกับตัวกรอง" /> : (
        <div className="card-soft overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="bg-[#162638]">
                <th className="th-cell">คู่ที่</th><th className="th-cell">ว/ด/ป</th><th className="th-cell">เวลา</th>
                <th className="th-cell">รอบ</th><th className="th-cell">ถ้วย</th><th className="th-cell">กลุ่ม</th>
                <th className="th-cell text-right">ทีมเหย้า</th><th className="th-cell text-center">ผล</th>
                <th className="th-cell">ทีมเยือน</th><th className="th-cell">สนาม</th><th className="th-cell no-print">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={`border-b border-[#eee7d6] last:border-0 ${m.played ? 'bg-[#f2efe6]' : 'bg-white'}`}>
                  <td className="td-cell font-display font-bold text-[#af915f]">{m.no}{m.note?.includes('เปิดสนาม') && <span className="ml-1 chip bg-[#af915f]/15 text-[#8a6f3e]">เปิดสนาม</span>}</td>
                  <td className="td-cell whitespace-nowrap">{m.date}</td>
                  <td className="td-cell whitespace-nowrap">{m.time}</td>
                  <td className="td-cell whitespace-nowrap">{ROUND_LABEL[m.round]}</td>
                  <td className="td-cell"><CupTag cup={m.cup} /></td>
                  <td className="td-cell">{m.group ?? '—'}</td>
                  <td className="td-cell max-w-44 truncate text-right font-semibold">{nameOf(m.homeId, m.homeLabel)}</td>
                  <td className="td-cell text-center">
                    {m.played
                      ? <span className="inline-block rounded-lg bg-[#162638] px-2.5 py-0.5 font-display font-bold text-[#fce1b6]">{m.homeScore} - {m.awayScore}</span>
                      : <span className="text-xs text-[#a49a80]">VS</span>}
                  </td>
                  <td className="td-cell max-w-44 truncate font-semibold">{nameOf(m.awayId, m.awayLabel)}</td>
                  <td className="td-cell max-w-40 truncate text-xs text-[#6b6248]">{m.venue.replace('สนามกีฬา', '')}</td>
                  <td className="td-cell no-print">
                    <div className="flex gap-1">
                      <button className="btn !px-2.5 !py-1 bg-[#2e7d5b] text-xs text-white hover:brightness-110" onClick={() => setResultFor(m)}>
                        <Trophy size={12} /> {m.played ? 'แก้ผล' : 'บันทึกผล'}
                      </button>
                      <button className="btn !px-2.5 !py-1 border border-[#d9d2c0] bg-white text-xs text-[#6b6248] hover:bg-[#fbf9f3]" onClick={() => setEditFor(m)}>
                        <Pencil size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ResultModal match={resultFor} onClose={() => setResultFor(null)} />
      <MatchFormModal match={editFor} onClose={() => setEditFor(null)}
        onSave={patch => update(s => ({ ...s, matches: s.matches.map(m => m.id === editFor!.id ? { ...m, ...patch } : m) }))} />
      <MatchFormModal open={adding} onClose={() => setAdding(false)}
        onSave={patch => update(s => ({
          ...s,
          matches: [...s.matches, {
            id: uid(), no: Math.max(...s.matches.map(m => m.no)) + 1,
            played: false, goals: [], homeId: null, awayId: null,
            homeLabel: 'ว่าง', awayLabel: 'ว่าง', cup: 'kor', round: 'group',
            date: '', isoDate: '', time: '16.30 น.', venue: VENUES[0], ...patch,
          } as Match].sort((a, b) => a.no - b.no),
        }))} />
    </div>
  );
}

// ---------------- บันทึกผล ----------------
function ResultModal({ match, onClose }: { match: Match | null; onClose: () => void }) {
  const { state, update } = useStore();
  const [home, setHome] = useState(0);
  const [away, setAway] = useState(0);
  const [goals, setGoals] = useState<GoalEvent[]>([]);
  const [gPlayer, setGPlayer] = useState('');
  const [gMinute, setGMinute] = useState('');
  const [gTeam, setGTeam] = useState<'home' | 'away'>('home');

  if (!match) return null;

  const openInit = () => {
    setHome(match.homeScore ?? 0);
    setAway(match.awayScore ?? 0);
    setGoals(match.goals);
  };

  const save = () => {
    update(s => ({
      ...s,
      matches: s.matches.map(m => m.id === match.id
        ? { ...m, played: true, homeScore: home, awayScore: away, goals }
        : m),
    }));
    onClose();
  };

  const teamName = (side: 'home' | 'away') => {
    const id = side === 'home' ? match.homeId : match.awayId;
    return id ? state.teams.find(t => t.id === id)?.name ?? 'ทีม' : (side === 'home' ? match.homeLabel : match.awayLabel);
  };

  return (
    <Modal open={!!match} onClose={onClose} title={`บันทึกผล คู่ที่ ${match.no} — ${match.date} ${match.time}`}>
      <InitEffect match={match} onInit={openInit} />
      <div className="rounded-2xl bg-[#162638] p-5 text-white">
        <div className="grid grid-cols-3 items-center gap-3 text-center">
          <div className="truncate text-sm font-semibold">{teamName('home')}</div>
          <div className="flex items-center justify-center gap-2">
            <input type="number" min={0} className="input w-16 !border-white/20 !bg-white/10 text-center font-display text-2xl font-bold !text-white" value={home} onChange={e => setHome(Math.max(0, +e.target.value))} />
            <span className="font-display text-xl text-[#c6a76e]">:</span>
            <input type="number" min={0} className="input w-16 !border-white/20 !bg-white/10 text-center font-display text-2xl font-bold !text-white" value={away} onChange={e => setAway(Math.max(0, +e.target.value))} />
          </div>
          <div className="truncate text-sm font-semibold">{teamName('away')}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-xs font-bold text-[#6b6248]">ผู้ทำประตู (ไม่บังคับ)</div>
        <div className="flex flex-wrap gap-2">
          <select className="input max-w-36" value={gTeam} onChange={e => setGTeam(e.target.value as 'home' | 'away')}>
            <option value="home">{teamName('home')}</option>
            <option value="away">{teamName('away')}</option>
          </select>
          <input className="input flex-1" placeholder="ชื่อผู้เล่น" value={gPlayer} onChange={e => setGPlayer(e.target.value)} />
          <input className="input w-20" placeholder="นาที" value={gMinute} onChange={e => setGMinute(e.target.value)} />
          <button className="btn-navy !py-2" onClick={() => {
            if (!gPlayer.trim()) return;
            const tid = gTeam === 'home' ? match.homeId : match.awayId;
            if (!tid) return;
            setGoals([...goals, { teamId: tid, player: gPlayer.trim(), minute: gMinute.trim() || '-' }]);
            setGPlayer(''); setGMinute('');
          }}>+ เพิ่ม</button>
        </div>
        {goals.length > 0 && (
          <ul className="mt-2 space-y-1">
            {goals.map((g, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-sm">
                <span>⚽ {g.player} <span className="text-xs text-[#8a8270]">({state.teams.find(t => t.id === g.teamId)?.name}) น.{g.minute}</span></span>
                <button className="text-xs text-[#b3372b] hover:underline" onClick={() => setGoals(goals.filter((_, j) => j !== i))}>ลบ</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        {match.played && (
          <button className="btn-ghost" onClick={() => {
            update(s => ({ ...s, matches: s.matches.map(m => m.id === match.id ? { ...m, played: false, homeScore: undefined, awayScore: undefined, goals: [] } : m) }));
            onClose();
          })}>ยกเลิกผลนัดนี้</button>
        )}
        <button className="btn-gold" onClick={save}>บันทึกผลการแข่งขัน</button>
      </div>
    </Modal>
  );
}

function InitEffect({ match, onInit }: { match: Match; onInit: () => void }) {
  const [done, setDone] = useState('');
  if (done !== match.id) { setDone(match.id); onInit(); }
  return null;
}

// ---------------- เพิ่ม/แก้ไขนัด ----------------
function MatchFormModal({ match, open, onClose, onSave }: {
  match?: Match | null; open?: boolean; onClose: () => void;
  onSave: (patch: Partial<Match>) => void;
}) {
  const { state } = useStore();
  const show = match != null || open === true;
  const [form, setForm] = useState<Partial<Match>>({});
  const [initFor, setInitFor] = useState('');

  if (show && initFor !== (match?.id ?? 'new')) {
    setInitFor(match?.id ?? 'new');
    setForm(match ?? { cup: 'kor', round: 'group', group: 'A', time: '16.30 น.', venue: VENUES[0] });
  }
  if (!show) return null;

  const set = (k: keyof Match, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={match ? `แก้ไขนัดคู่ที่ ${match.no}` : 'เพิ่มนัดแข่งขันใหม่'}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="ว/ด/ป (เช่น 25-ต.ค.-69)"><input className="input" value={form.date ?? ''} onChange={e => set('date', e.target.value)} /></Field>
        <Field label="เวลา"><input className="input" value={form.time ?? ''} onChange={e => set('time', e.target.value)} /></Field>
        <Field label="ถ้วย">
          <select className="input" value={form.cup} onChange={e => set('cup', e.target.value)}>
            {(['kor', 'khor', 'u17'] as CupId[]).map(c => <option key={c} value={c}>{CUP_LABEL[c]}</option>)}
          </select>
        </Field>
        <Field label="รอบ">
          <select className="input" value={form.round} onChange={e => set('round', e.target.value)}>
            {ROUND_ORDER.map(r => <option key={r} value={r}>{ROUND_LABEL[r]}</option>)}
          </select>
        </Field>
        <Field label="ทีมเหย้า">
          <select className="input" value={form.homeId ?? ''} onChange={e => set('homeId', e.target.value || null)}>
            <option value="">— ยังไม่ทราบ —</option>
            {state.teams.map(t => <option key={t.id} value={t.id}>{CUP_LABEL[t.cup]}: {t.name}</option>)}
          </select>
        </Field>
        <Field label="ทีมเยือน">
          <select className="input" value={form.awayId ?? ''} onChange={e => set('awayId', e.target.value || null)}>
            <option value="">— ยังไม่ทราบ —</option>
            {state.teams.map(t => <option key={t.id} value={t.id}>{CUP_LABEL[t.cup]}: {t.name}</option>)}
          </select>
        </Field>
        <Field label="สนาม">
          <select className="input" value={form.venue} onChange={e => set('venue', e.target.value)}>
            {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="หมายเหตุ"><input className="input" value={form.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>ยกเลิก</button>
        <button className="btn-gold" onClick={() => { onSave(form); onClose(); }}>บันทึก</button>
      </div>
    </Modal>
  );
}
