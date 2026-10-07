import { useMemo, useState } from 'react';
import { BadgeCheck, CircleDollarSign, HandCoins, Pencil, Plus, Printer, RotateCcw, Trash2 } from 'lucide-react';
import { fmtBaht, uid, useStore } from '../store';
import type { CupId, Deposit, DepositStatus, DisciplineRecord, Sponsor, SponsorTier } from '../types';
import { CUP_LABEL, DEPOSIT_AMOUNT, FINE_RATE, TIER_LABEL } from '../types';
import { CupTag, EmptyState, Field, Modal, PageHeader, StatCard } from './ui-bits';

const todayTH = () => {
  const d = new Date();
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${d.getDate()}-${months[d.getMonth()]}-${String((d.getFullYear() + 543) % 100).padStart(2, '0')}`;
};

// =============================================================
// เงินประกันทีม
// =============================================================
export function DepositView() {
  const { state, update, depositOf, fineOf } = useStore();
  const [cup, setCup] = useState<'all' | CupId>('all');
  const [status, setStatus] = useState<'all' | DepositStatus>('all');
  const [payFor, setPayFor] = useState<string | null>(null);

  const rows = state.teams
    .filter(t => cup === 'all' || t.cup === cup)
    .map(t => ({ team: t, dep: depositOf(t.id), fine: fineOf(t.id) }))
    .filter(r => status === 'all' || r.dep.status === status);

  const collected = state.deposits.filter(d => d.status !== 'unpaid').reduce((s, d) => s + d.amount, 0);
  const outstanding = 39 * DEPOSIT_AMOUNT - collected;
  const totalFine = state.discipline.reduce((s, d) => s + d.amount, 0);
  const refundable = state.deposits.reduce((s, d) => s + Math.max(0, d.amount - fineOf(d.teamId)), 0);

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="ระบบบันทึกเงินประกันทีม"
        desc={`ทีมละ ${fmtBaht(DEPOSIT_AMOUNT)} • ค่าปรับวินัยหักอัตโนมัติ • คืนเงินหลังจบการแข่งขัน`}
        actions={<button className="btn-ghost" onClick={() => window.print()}><Printer size={15} /> พิมพ์สรุป</button>}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard tone="green" label="เก็บเงินประกันแล้ว" value={fmtBaht(collected)} sub={`${state.deposits.filter(d => d.status !== 'unpaid').length}/39 ทีม`} />
        <StatCard tone="red" label="ยอดค้างชำระ" value={fmtBaht(outstanding)} sub={`${state.deposits.filter(d => d.status === 'unpaid').length} ทีม`} />
        <StatCard tone="navy" label="หักค่าปรับรวม" value={fmtBaht(totalFine)} sub="จากใบเหลือง/แดง/แบน" />
        <StatCard tone="gold" label="ยอดคืนประกัน (ประมาณ)" value={fmtBaht(refundable)} sub="หักค่าปรับแล้ว" />
      </div>

      <div className="card-soft mb-4 mt-5 flex flex-wrap items-center gap-2 p-4 no-print">
        <span className="text-xs font-bold text-[#6b6248]">ถ้วย:</span>
        {(['all', 'kor', 'khor', 'u17'] as const).map(c => (
          <button key={c} onClick={() => setCup(c)} className={`btn !px-3 !py-1.5 text-xs ${cup === c ? 'bg-[#162638] text-[#fce1b6]' : 'bg-white border border-[#d9d2c0] text-[#6b6248]'}`}>{c === 'all' ? 'ทั้งหมด' : CUP_LABEL[c]}</button>
        ))}
        <span className="ml-2 text-xs font-bold text-[#6b6248]">สถานะ:</span>
        {([['all', 'ทั้งหมด'], ['unpaid', 'ค้างชำระ'], ['paid', 'ชำระแล้ว'], ['refunded', 'คืนแล้ว']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setStatus(v)} className={`btn !px-3 !py-1.5 text-xs ${status === v ? 'bg-[#af915f] text-white' : 'bg-white border border-[#d9d2c0] text-[#6b6248]'}`}>{l}</button>
        ))}
      </div>

      <div className="card-soft overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="bg-[#162638]">
              <th className="th-cell">#</th><th className="th-cell">ทีม</th><th className="th-cell">ถ้วย</th>
              <th className="th-cell text-right">เงินประกัน</th><th className="th-cell text-right">หักค่าปรับ</th>
              <th className="th-cell text-right">คงเหลือ</th><th className="th-cell">สถานะ</th>
              <th className="th-cell">ใบเสร็จ/วันที่</th><th className="th-cell no-print">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.team.id} className="border-b border-[#eee7d6] bg-white last:border-0">
                <td className="td-cell text-[#8a8270]">{i + 1}</td>
                <td className="td-cell font-semibold"><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: r.team.color }} />{r.team.name}</td>
                <td className="td-cell"><CupTag cup={r.team.cup} /></td>
                <td className="td-cell text-right">{fmtBaht(r.dep.amount)}</td>
                <td className={`td-cell text-right ${r.fine > 0 ? 'font-bold text-[#b3372b]' : 'text-[#a49a80]'}`}>{fmtBaht(r.fine)}</td>
                <td className="td-cell text-right font-display font-bold text-[#2e7d5b]">{fmtBaht(Math.max(0, r.dep.amount - r.fine))}</td>
                <td className="td-cell">
                  {r.dep.status === 'paid' && <span className="chip bg-[#2e7d5b]/10 text-[#2e7d5b]"><BadgeCheck size={12} /> ชำระแล้ว</span>}
                  {r.dep.status === 'unpaid' && <span className="chip bg-[#b3372b]/10 text-[#b3372b]">ค้างชำระ</span>}
                  {r.dep.status === 'refunded' && <span className="chip bg-[#2a4560]/10 text-[#2a4560]"><RotateCcw size={12} /> คืนแล้ว</span>}
                </td>
                <td className="td-cell text-xs text-[#6b6248]">{r.dep.receiptNo ? `${r.dep.receiptNo} • ${r.dep.paidDate}` : '—'}</td>
                <td className="td-cell no-print">
                  <div className="flex gap-1">
                    {r.dep.status === 'unpaid' && <button className="btn !px-2.5 !py-1 bg-[#2e7d5b] text-xs text-white" onClick={() => setPayFor(r.team.id)}>รับชำระ</button>}
                    {r.dep.status === 'paid' && (
                      <>
                        <button className="btn !px-2.5 !py-1 border border-[#d9d2c0] bg-white text-xs text-[#6b6248]" onClick={() => setPayFor(r.team.id)}><Pencil size={11} /></button>
                        <button className="btn !px-2.5 !py-1 bg-[#2a4560] text-xs text-white" onClick={() => {
                          if (window.confirm(`ยืนยันคืนเงินประกัน ${fmtBaht(Math.max(0, r.dep.amount - r.fine))} ให้ ${r.team.name}?`))
                            update(s => ({ ...s, deposits: s.deposits.map(d => d.teamId === r.team.id ? { ...d, status: 'refunded' } : d) }));
                        }}>คืนเงิน</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PayDepositModal teamId={payFor} onClose={() => setPayFor(null)} />
    </div>
  );
}

function PayDepositModal({ teamId, onClose }: { teamId: string | null; onClose: () => void }) {
  const { state, update, depositOf } = useStore();
  const [receipt, setReceipt] = useState('');
  const [method, setMethod] = useState('เงินสด');
  const [date, setDate] = useState(todayTH());
  const [note, setNote] = useState('');
  const [initFor, setInitFor] = useState('');
  if (teamId && initFor !== teamId) {
    setInitFor(teamId);
    const dep = depositOf(teamId);
    setReceipt(dep.receiptNo ?? ''); setMethod(dep.method ?? 'เงินสด'); setDate(dep.paidDate ?? todayTH()); setNote(dep.note ?? '');
  }
  if (!teamId) return null;
  const team = state.teams.find(t => t.id === teamId)!;

  return (
    <Modal open onClose={onClose} title={`บันทึกชำระเงินประกัน — ${team.name}`}>
      <div className="rounded-xl bg-[#162638] p-4 text-center text-white">
        <div className="text-xs text-white/60">ยอดเงินประกัน</div>
        <div className="font-display text-3xl font-bold text-[#fce1b6]">{fmtBaht(DEPOSIT_AMOUNT)}</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="เลขที่ใบเสร็จ"><input className="input" value={receipt} onChange={e => setReceipt(e.target.value)} placeholder="เช่น 001/2569" /></Field>
        <Field label="วันที่ชำระ"><input className="input" value={date} onChange={e => setDate(e.target.value)} /></Field>
        <Field label="ช่องทางชำระ">
          <select className="input" value={method} onChange={e => setMethod(e.target.value)}>
            <option>เงินสด</option><option>โอนผ่านธนาคาร</option><option>พร้อมเพย์</option>
          </select>
        </Field>
        <Field label="หมายเหตุ"><input className="input" value={note} onChange={e => setNote(e.target.value)} /></Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>ยกเลิก</button>
        <button className="btn-gold" onClick={() => {
          update(s => ({
            ...s,
            deposits: s.deposits.map(d => d.teamId === teamId
              ? { ...d, status: 'paid', receiptNo: receipt, paidDate: date, method, note } : d),
          }));
          onClose();
        }}>ยืนยันรับชำระ</button>
      </div>
    </Modal>
  );
}

// =============================================================
// ค่าปรับ & วินัย
// =============================================================
export function FineView() {
  const { state, update, depositOf } = useStore();
  const [adding, setAdding] = useState(false);
  const [cup, setCup] = useState<'all' | CupId>('all');

  const yellows = state.discipline.filter(d => d.type === 'yellow').length;
  const reds = state.discipline.filter(d => d.type === 'red').length;
  const bans = state.discipline.filter(d => d.type === 'ban').length;
  const total = state.discipline.reduce((s, d) => s + d.amount, 0);

  const teamRows = state.teams
    .filter(t => cup === 'all' || t.cup === cup)
    .map(t => {
      const recs = state.discipline.filter(d => d.teamId === t.id);
      return {
        team: t,
        y: recs.filter(r => r.type === 'yellow').length,
        r: recs.filter(r => r.type === 'red').length,
        b: recs.filter(r => r.type === 'ban').length,
        fine: recs.reduce((s, x) => s + x.amount, 0),
      };
    });

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="บันทึกคาดโทษ & ค่าปรับวินัย"
        desc={`ตามข้อบังคับ 5.2 — ใบเหลือง ${FINE_RATE.yellow} ฿ • ใบแดง ${FINE_RATE.redMin}-${FINE_RATE.redMax} ฿ • หักจากเงินประกันอัตโนมัติ`}
        actions={
          <>
            <button className="btn-ghost" onClick={() => window.print()}><Printer size={15} /> พิมพ์</button>
            <button className="btn-danger" onClick={() => setAdding(true)}><Plus size={15} /> บันทึกคาดโทษ</button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard tone="red" label="ยอดค่าปรับรวม" value={fmtBaht(total)} sub={`${state.discipline.length} รายการ`} />
        <StatCard tone="gold" label="ใบเหลือง" value={yellows} sub={`ใบละ ${FINE_RATE.yellow} ฿`} />
        <StatCard tone="red" label="ใบแดง" value={reds} sub={`${FINE_RATE.redMin}-${FINE_RATE.redMax} ฿`} />
        <StatCard tone="navy" label="โทษแบน" value={bans} sub="ห้ามลงสนามตามคำสั่งฝ่ายจัดฯ" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-5">
        <section className="card-soft overflow-x-auto xl:col-span-3">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#eee7d6] p-3 no-print">
            <span className="text-xs font-bold text-[#6b6248]">กรองถ้วย:</span>
            {(['all', 'kor', 'khor', 'u17'] as const).map(c => (
              <button key={c} onClick={() => setCup(c)} className={`btn !px-3 !py-1 text-xs ${cup === c ? 'bg-[#162638] text-[#fce1b6]' : 'bg-white border border-[#d9d2c0] text-[#6b6248]'}`}>{c === 'all' ? 'ทั้งหมด' : CUP_LABEL[c]}</button>
            ))}
          </div>
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="bg-[#f1ecdf] text-left text-[11px] uppercase tracking-wide text-[#6b6248]">
                <th className="px-3 py-2">ทีม</th><th className="px-3 py-2 text-center">🟨</th><th className="px-3 py-2 text-center">🟥</th>
                <th className="px-3 py-2 text-center">🚫</th><th className="px-3 py-2 text-right">ค่าปรับ</th><th className="px-3 py-2 text-right">ประกันคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {teamRows.map(r => (
                <tr key={r.team.id} className={`border-b border-[#eee7d6] last:border-0 ${r.fine > 0 ? 'bg-[#b3372b]/[0.04]' : 'bg-white'}`}>
                  <td className="px-3 py-2 text-sm font-semibold">{r.team.name} <span className="text-[10px] text-[#8a8270]">({CUP_LABEL[r.team.cup]})</span></td>
                  <td className="px-3 py-2 text-center text-sm">{r.y || '-'}</td>
                  <td className="px-3 py-2 text-center text-sm">{r.r || '-'}</td>
                  <td className="px-3 py-2 text-center text-sm">{r.b || '-'}</td>
                  <td className={`px-3 py-2 text-right text-sm ${r.fine > 0 ? 'font-bold text-[#b3372b]' : 'text-[#a49a80]'}`}>{fmtBaht(r.fine)}</td>
                  <td className="px-3 py-2 text-right text-sm font-display font-bold text-[#2e7d5b]">{fmtBaht(Math.max(0, depositOf(r.team.id).amount - r.fine))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card-soft p-4 xl:col-span-2">
          <h3 className="font-display font-bold text-[#162638]">ประวัติการคาดโทษ ({state.discipline.length})</h3>
          <div className="mt-3 max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {state.discipline.length === 0 && <EmptyState text="ยังไม่มีบันทึกการคาดโทษ" />}
            {[...state.discipline].reverse().map(d => {
              const team = state.teams.find(t => t.id === d.teamId);
              return (
                <div key={d.id} className="rounded-xl border border-[#eee7d6] bg-white p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className={`chip ${d.type === 'yellow' ? 'bg-[#e6b93d]/20 text-[#8a6f3e]' : d.type === 'red' ? 'bg-[#b3372b]/10 text-[#b3372b]' : 'bg-[#162638] text-[#fce1b6]'}`}>
                      {d.type === 'yellow' ? '🟨 ใบเหลือง' : d.type === 'red' ? '🟥 ใบแดง' : '🚫 โทษแบน'}
                    </span>
                    <span className="font-display font-bold text-[#b3372b]">{fmtBaht(d.amount)}</span>
                  </div>
                  <div className="mt-1.5 font-semibold">{d.player} <span className="text-xs font-normal text-[#8a8270]">({team?.name})</span></div>
                  <div className="mt-0.5 text-xs text-[#8a8270]">{d.date}{d.matchNo ? ` • คู่ที่ ${d.matchNo}` : ''} • {d.note}</div>
                  <button className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#b3372b] hover:underline no-print"
                    onClick={() => { if (window.confirm('ลบบันทึกนี้?')) update(s => ({ ...s, discipline: s.discipline.filter(x => x.id !== d.id) })); }}>
                    <Trash2 size={11} /> ลบ
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <AddFineModal open={adding} onClose={() => setAdding(false)} />
    </div>
  );
}

function AddFineModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, update } = useStore();
  const [teamId, setTeamId] = useState('');
  const [player, setPlayer] = useState('');
  const [type, setType] = useState<'yellow' | 'red' | 'ban'>('yellow');
  const [amount, setAmount] = useState<number>(FINE_RATE.yellow);
  const [matchNo, setMatchNo] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayTH());
  const [init, setInit] = useState(false);
  if (open && !init) { setInit(true); setTeamId(''); setPlayer(''); setType('yellow'); setAmount(FINE_RATE.yellow); setMatchNo(''); setNote(''); setDate(todayTH()); }
  if (!open) { if (init) setInit(false); return null; }

  return (
    <Modal open onClose={onClose} title="บันทึกการคาดโทษใหม่">
      <div className="grid grid-cols-2 gap-3">
        <Field label="ทีม">
          <select className="input" value={teamId} onChange={e => setTeamId(e.target.value)}>
            <option value="">— เลือกทีม —</option>
            {state.teams.map(t => <option key={t.id} value={t.id}>{CUP_LABEL[t.cup]}: {t.name}</option>)}
          </select>
        </Field>
        <Field label="ชื่อนักกีฬา"><input className="input" value={player} onChange={e => setPlayer(e.target.value)} /></Field>
        <Field label="ประเภทโทษ">
          <select className="input" value={type} onChange={e => {
            const t = e.target.value as 'yellow' | 'red' | 'ban';
            setType(t); setAmount(t === 'yellow' ? FINE_RATE.yellow : t === 'red' ? FINE_RATE.redMin : 0);
          }}>
            <option value="yellow">🟨 ใบเหลือง (100 ฿)</option>
            <option value="red">🟥 ใบแดง (300-1,000 ฿)</option>
            <option value="ban">🚫 โทษแบน</option>
          </select>
        </Field>
        <Field label="จำนวนเงินปรับ (บาท)"><input type="number" min={0} className="input" value={amount} onChange={e => setAmount(Math.max(0, +e.target.value))} /></Field>
        <Field label="คู่ที่ (ถ้ามี)"><input type="number" min={1} className="input" value={matchNo} onChange={e => setMatchNo(e.target.value)} /></Field>
        <Field label="วันที่"><input className="input" value={date} onChange={e => setDate(e.target.value)} /></Field>
        <div className="col-span-2"><Field label="รายละเอียด"><input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="เช่น น.27 ทำฟาวล์รุนแรง" /></Field></div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>ยกเลิก</button>
        <button className="btn-danger" onClick={() => {
          if (!teamId || !player.trim()) return;
          const rec: DisciplineRecord = { id: uid(), date, matchNo: matchNo ? +matchNo : undefined, teamId, player: player.trim(), type, amount, note: note.trim() || '—' };
          update(s => ({ ...s, discipline: [...s.discipline, rec] }));
          onClose();
        }}>บันทึกและหักเงินประกัน</button>
      </div>
    </Modal>
  );
}

// =============================================================
// สปอนเซอร์
// =============================================================
const TIER_STYLE: Record<SponsorTier, string> = {
  diamond: 'bg-gradient-to-r from-[#7db4d8] to-[#4a7fa5] text-white',
  gold: 'bg-gradient-to-r from-[#d9bd85] to-[#af915f] text-white',
  silver: 'bg-gradient-to-r from-[#c9ced6] to-[#98a2ae] text-[#1c2430]',
  bronze: 'bg-gradient-to-r from-[#c98d5f] to-[#a05f35] text-white',
  support: 'bg-[#162638]/10 text-[#162638]',
};

export function SponsorView() {
  const { state, update } = useStore();
  const [adding, setAdding] = useState(false);
  const [edit, setEdit] = useState<Sponsor | null>(null);

  const received = state.sponsors.filter(s => s.status === 'received').reduce((s, x) => s + x.amount, 0);
  const pledged = state.sponsors.filter(s => s.status === 'pledged').reduce((s, x) => s + x.amount, 0);
  const depositCollected = state.deposits.filter(d => d.status !== 'unpaid').reduce((s, d) => s + d.amount, 0);
  const fineTotal = state.discipline.reduce((s, d) => s + d.amount, 0);

  const sorted = useMemo(() => [...state.sponsors].sort((a, b) => b.amount - a.amount), [state.sponsors]);

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="ทะเบียนสปอนเซอร์ & ผู้สนับสนุน"
        desc="บันทึกยอดสนับสนุน 5 ระดับ พร้อมติดตามยอดรับจริงและคำสัญญา"
        actions={<button className="btn-gold" onClick={() => setAdding(true)}><Plus size={15} /> เพิ่มสปอนเซอร์</button>}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard tone="gold" label="ยอดสปอนเซอร์รับแล้ว" value={fmtBaht(received)} sub={`${state.sponsors.filter(s => s.status === 'received').length} ราย`} />
        <StatCard tone="navy" label="คำสัญญาค้างรับ" value={fmtBaht(pledged)} sub={`${state.sponsors.filter(s => s.status === 'pledged').length} ราย`} />
        <StatCard tone="green" label="รายรับรวมการแข่งขัน" value={fmtBaht(received + depositCollected)} sub="สปอนเซอร์ + เงินประกัน" />
        <StatCard tone="red" label="ค่าปรับ (รายรับอื่น)" value={fmtBaht(fineTotal)} sub="หักจากเงินประกัน" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sorted.length === 0 && <div className="md:col-span-2 xl:col-span-3"><EmptyState text="ยังไม่มีข้อมูลสปอนเซอร์ — กดเพิ่มสปอนเซอร์เพื่อเริ่มบันทึก" /></div>}
        {sorted.map(sp => (
          <div key={sp.id} className="card-soft p-4 transition hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <span className={`chip ${TIER_STYLE[sp.tier]}`}><HandCoins size={12} /> {TIER_LABEL[sp.tier]}</span>
              <span className={`chip ${sp.status === 'received' ? 'bg-[#2e7d5b]/10 text-[#2e7d5b]' : 'bg-[#b3372b]/10 text-[#b3372b]'}`}>
                {sp.status === 'received' ? 'รับแล้ว' : 'คำสัญญา'}
              </span>
            </div>
            <div className="mt-2.5 font-display text-lg font-bold text-[#162638]">{sp.name}</div>
            <div className="font-display text-2xl font-bold text-[#af915f]">{fmtBaht(sp.amount)}</div>
            <div className="mt-1 space-y-0.5 text-xs text-[#8a8270]">
              {sp.inKind && <div>สิ่งของ: {sp.inKind}</div>}
              {sp.contact && <div>ติดต่อ: {sp.contact}</div>}
              {sp.date && <div>วันที่: {sp.date}</div>}
              {sp.note && <div>หมายเหตุ: {sp.note}</div>}
            </div>
            <div className="mt-3 flex gap-2 no-print">
              <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setEdit(sp)}><Pencil size={12} /> แก้ไข</button>
              {sp.status === 'pledged' && (
                <button className="btn !px-3 !py-1.5 bg-[#2e7d5b] text-xs text-white" onClick={() =>
                  update(s => ({ ...s, sponsors: s.sponsors.map(x => x.id === sp.id ? { ...x, status: 'received', date: todayTH() } : x) }))}>
                  <CircleDollarSign size={12} /> รับเงินแล้ว
                </button>
              )}
              <button className="btn !px-3 !py-1.5 text-xs text-[#b3372b] hover:bg-[#b3372b]/5" onClick={() => {
                if (window.confirm(`ลบ ${sp.name}?`)) update(s => ({ ...s, sponsors: s.sponsors.filter(x => x.id !== sp.id) }));
              }}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      <SponsorFormModal open={adding} sponsor={edit} onClose={() => { setAdding(false); setEdit(null); }} />
    </div>
  );
}

function SponsorFormModal({ open, sponsor, onClose }: { open: boolean; sponsor: Sponsor | null; onClose: () => void }) {
  const { update } = useStore();
  const show = open || sponsor != null;
  const [form, setForm] = useState<Partial<Sponsor>>({});
  const [initFor, setInitFor] = useState('');
  if (show && initFor !== (sponsor?.id ?? 'new')) {
    setInitFor(sponsor?.id ?? 'new');
    setForm(sponsor ?? { tier: 'support', status: 'pledged', date: todayTH() });
  }
  if (!show) { if (initFor) setInitFor(''); return null; }
  const set = (k: keyof Sponsor, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={sponsor ? `แก้ไข — ${sponsor.name}` : 'เพิ่มสปอนเซอร์ใหม่'}>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="ชื่อผู้สนับสนุน"><input className="input" value={form.name ?? ''} onChange={e => set('name', e.target.value)} /></Field></div>
        <Field label="ระดับ">
          <select className="input" value={form.tier} onChange={e => set('tier', e.target.value)}>
            {(Object.keys(TIER_LABEL) as SponsorTier[]).map(t => <option key={t} value={t}>{TIER_LABEL[t]}</option>)}
          </select>
        </Field>
        <Field label="ยอดเงิน (บาท)"><input type="number" min={0} className="input" value={form.amount ?? 0} onChange={e => set('amount', Math.max(0, +e.target.value))} /></Field>
        <Field label="สิ่งของ/บริการ (ถ้ามี)"><input className="input" value={form.inKind ?? ''} onChange={e => set('inKind', e.target.value)} /></Field>
        <Field label="ผู้ติดต่อ"><input className="input" value={form.contact ?? ''} onChange={e => set('contact', e.target.value)} /></Field>
        <Field label="สถานะ">
          <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="pledged">คำสัญญา</option><option value="received">รับแล้ว</option>
          </select>
        </Field>
        <Field label="วันที่"><input className="input" value={form.date ?? ''} onChange={e => set('date', e.target.value)} /></Field>
        <div className="col-span-2"><Field label="หมายเหตุ"><input className="input" value={form.note ?? ''} onChange={e => set('note', e.target.value)} /></Field></div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>ยกเลิก</button>
        <button className="btn-gold" onClick={() => {
          if (!form.name?.trim()) return;
          if (sponsor) update(s => ({ ...s, sponsors: s.sponsors.map(x => x.id === sponsor.id ? { ...x, ...form } as Sponsor : x) }));
          else update(s => ({ ...s, sponsors: [...s.sponsors, { id: uid(), ...form } as Sponsor] }));
          onClose();
        }}>บันทึก</button>
      </div>
    </Modal>
  );
}

// re-export unused type guard
export type { Deposit };
