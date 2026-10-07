import { useState } from 'react';
import { CheckCircle2, Clock, Printer, Repeat, ShieldCheck, Stamp, Trash2 } from 'lucide-react';
import { uid, useStore } from '../store';
import type { RefereeReport, StaffShift, Substitution } from '../types';
import { EVENT_INFO } from '../data/seed';
import { CUP_LABEL } from '../types';
import { Field, Modal, PageHeader } from './ui-bits';

const todayTH = () => {
  const d = new Date();
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${d.getDate()}-${months[d.getMonth()]}-${String((d.getFullYear() + 543) % 100).padStart(2, '0')}`;
};

function DocPaper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="print-page rounded-xl border border-[#e6dfcd] bg-white p-6 text-sm">
      <div className="mb-4 border-b-2 border-[#162638] pb-3 text-center">
        <div className="font-display text-base font-bold text-[#162638]">{title}</div>
        <div className="text-xs text-[#6b6248]">{EVENT_INFO.title} {EVENT_INFO.year} • {EVENT_INFO.host}</div>
      </div>
      {children}
    </div>
  );
}

export default function Documents() {
  const { state, update } = useStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [shiftOpen, setShiftOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="เอกสารการแข่งขัน 4 หมวด"
        desc="รายงานผู้ตัดสิน • ใบลงเวลาเจ้าหน้าที่ • ใบเปลี่ยนตัว • ตรวจคุณสมบัติ — กดพิมพ์เพื่อออกเอกสารรวมเล่ม (สตง.)"
        actions={<button className="btn-gold" onClick={() => window.print()}><Printer size={15} /> พิมพ์รวมเล่ม</button>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 no-print">
        <button className="card-soft p-4 text-left transition hover:shadow-md" onClick={() => setReportOpen(true)}>
          <Stamp size={20} className="text-[#af915f]" />
          <div className="mt-2 font-display font-bold text-[#162638]">หมวด 1: รายงานผู้ตัดสิน</div>
          <div className="text-xs text-[#8a8270]">{state.reports.length} ฉบับ</div>
        </button>
        <button className="card-soft p-4 text-left transition hover:shadow-md" onClick={() => setShiftOpen(true)}>
          <Clock size={20} className="text-[#af915f]" />
          <div className="mt-2 font-display font-bold text-[#162638]">หมวด 2: ใบลงเวลา จนท.</div>
          <div className="text-xs text-[#8a8270]">{state.shifts.length} รายการ</div>
        </button>
        <div className="card-soft p-4 text-left">
          <ShieldCheck size={20} className="text-[#af915f]" />
          <div className="mt-2 font-display font-bold text-[#162638]">หมวด 3: คาดโทษ & วินัย</div>
          <div className="text-xs text-[#8a8270]">{state.discipline.length} รายการ (ซิงค์จากเมนูค่าปรับ)</div>
        </div>
        <button className="card-soft p-4 text-left transition hover:shadow-md" onClick={() => setSubOpen(true)}>
          <Repeat size={20} className="text-[#af915f]" />
          <div className="mt-2 font-display font-bold text-[#162638]">หมวด 4: ใบเปลี่ยนตัว</div>
          <div className="text-xs text-[#8a8270]">{state.subs.length} ใบ</div>
        </button>
      </div>

      {/* ตรวจคุณสมบัติ 14 อปท. */}
      <section className="card-soft mb-6 p-5">
        <h2 className="font-display text-lg font-bold text-[#162638]">ตรวจคุณสมบัตินักกีฬา — 14 อปท.</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {state.eligibility.map(e => (
            <label key={e.org} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${e.checked ? 'border-[#2e7d5b]/40 bg-[#2e7d5b]/5' : 'border-[#eee7d6] bg-white'}`}>
              <input type="checkbox" checked={e.checked} className="h-4 w-4 accent-[#2e7d5b]"
                onChange={ev => update(s => ({
                  ...s,
                  eligibility: s.eligibility.map(x => x.org === e.org
                    ? { ...x, checked: ev.target.checked, checkedAt: ev.target.checked ? todayTH() : undefined } : x),
                }))} />
              <span className="flex-1 font-semibold">{e.org}</span>
              {e.checked && <span className="chip bg-[#2e7d5b]/10 text-[#2e7d5b]"><CheckCircle2 size={11} /> {e.checkedAt}</span>}
            </label>
          ))}
        </div>
      </section>

      {/* print bundle */}
      <div className="space-y-6">
        <DocPaper title="หมวด 1 — รายงานผู้ตัดสิน">
          {state.reports.length === 0 ? <p className="text-center text-[#8a8270]">— ยังไม่มีรายงาน —</p> : (
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-[#f1ecdf]">
                <th className="border border-[#d9d2c0] px-2 py-1.5">คู่ที่</th><th className="border border-[#d9d2c0] px-2 py-1.5">ผู้ตัดสิน</th>
                <th className="border border-[#d9d2c0] px-2 py-1.5">ผู้ช่วย 1-2</th><th className="border border-[#d9d2c0] px-2 py-1.5">สรุปผล</th><th className="border border-[#d9d2c0] px-2 py-1.5">เหตุการณ์</th>
              </tr></thead>
              <tbody>
                {state.reports.map(r => (
                  <tr key={r.id}>
                    <td className="border border-[#d9d2c0] px-2 py-1.5 text-center">{r.matchNo}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{r.referee}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{r.assistant1} / {r.assistant2}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{r.summary}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{r.incidents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DocPaper>

        <DocPaper title="หมวด 2 — ใบลงเวลาเจ้าหน้าที่">
          {state.shifts.length === 0 ? <p className="text-center text-[#8a8270]">— ยังไม่มีการลงเวลา —</p> : (
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-[#f1ecdf]">
                <th className="border border-[#d9d2c0] px-2 py-1.5">วันที่</th><th className="border border-[#d9d2c0] px-2 py-1.5">ชื่อ</th>
                <th className="border border-[#d9d2c0] px-2 py-1.5">หน้าที่</th><th className="border border-[#d9d2c0] px-2 py-1.5">สนาม</th>
                <th className="border border-[#d9d2c0] px-2 py-1.5">เข้า</th><th className="border border-[#d9d2c0] px-2 py-1.5">ออก</th>
              </tr></thead>
              <tbody>
                {state.shifts.map(s2 => (
                  <tr key={s2.id}>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{s2.date}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{s2.name}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{s2.role}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{s2.venue}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5 text-center">{s2.checkIn}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5 text-center">{s2.checkOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DocPaper>

        <DocPaper title="หมวด 3 — บันทึกคาดโทษ & วินัย">
          {state.discipline.length === 0 ? <p className="text-center text-[#8a8270]">— ไม่มีการคาดโทษ —</p> : (
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-[#f1ecdf]">
                <th className="border border-[#d9d2c0] px-2 py-1.5">วันที่</th><th className="border border-[#d9d2c0] px-2 py-1.5">คู่ที่</th>
                <th className="border border-[#d9d2c0] px-2 py-1.5">นักกีฬา</th><th className="border border-[#d9d2c0] px-2 py-1.5">ทีม</th>
                <th className="border border-[#d9d2c0] px-2 py-1.5">โทษ</th><th className="border border-[#d9d2c0] px-2 py-1.5">ปรับ (฿)</th><th className="border border-[#d9d2c0] px-2 py-1.5">รายละเอียด</th>
              </tr></thead>
              <tbody>
                {state.discipline.map(d => (
                  <tr key={d.id}>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{d.date}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5 text-center">{d.matchNo ?? '-'}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{d.player}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{state.teams.find(t => t.id === d.teamId)?.name}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5 text-center">{d.type === 'yellow' ? 'ใบเหลือง' : d.type === 'red' ? 'ใบแดง' : 'โทษแบน'}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5 text-right">{d.amount.toLocaleString()}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DocPaper>

        <DocPaper title="หมวด 4 — ใบเปลี่ยนตัวนักกีฬา">
          {state.subs.length === 0 ? <p className="text-center text-[#8a8270]">— ยังไม่มีใบเปลี่ยนตัว —</p> : (
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-[#f1ecdf]">
                <th className="border border-[#d9d2c0] px-2 py-1.5">คู่ที่</th><th className="border border-[#d9d2c0] px-2 py-1.5">ทีม</th>
                <th className="border border-[#d9d2c0] px-2 py-1.5">ออก</th><th className="border border-[#d9d2c0] px-2 py-1.5">เข้า</th><th className="border border-[#d9d2c0] px-2 py-1.5">นาที</th>
              </tr></thead>
              <tbody>
                {state.subs.map(sb => (
                  <tr key={sb.id}>
                    <td className="border border-[#d9d2c0] px-2 py-1.5 text-center">{sb.matchNo}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{state.teams.find(t => t.id === sb.teamId)?.name}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{sb.outPlayer}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5">{sb.inPlayer}</td>
                    <td className="border border-[#d9d2c0] px-2 py-1.5 text-center">{sb.minute}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DocPaper>
      </div>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
      <ShiftModal open={shiftOpen} onClose={() => setShiftOpen(false)} />
      <SubModal open={subOpen} onClose={() => setSubOpen(false)} />
    </div>
  );
}

function ReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, update } = useStore();
  const [f, setF] = useState<Partial<RefereeReport>>({});
  const [init, setInit] = useState(false);
  if (open && !init) { setInit(true); setF({ createdAt: todayTH() }); }
  if (!open) { if (init) setInit(false); return null; }
  const set = (k: keyof RefereeReport, v: unknown) => setF(x => ({ ...x, [k]: v }));

  return (
    <Modal open onClose={onClose} title="สร้างรายงานผู้ตัดสิน (หมวด 1)" wide>
      <div className="mb-4 max-h-40 space-y-1 overflow-y-auto rounded-xl bg-white p-3 text-xs">
        {state.reports.length === 0 && <span className="text-[#8a8270]">ยังไม่มีรายงานในระบบ</span>}
        {state.reports.map(r => (
          <div key={r.id} className="flex items-center justify-between border-b border-[#f1ecdf] py-1 last:border-0">
            <span>คู่ที่ {r.matchNo} — {r.referee} ({r.createdAt})</span>
            <button className="text-[#b3372b] hover:underline" onClick={() => update(s => ({ ...s, reports: s.reports.filter(x => x.id !== r.id) }))}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="คู่ที่">
          <select className="input" value={f.matchNo ?? ''} onChange={e => set('matchNo', +e.target.value)}>
            <option value="">— เลือก —</option>
            {state.matches.map(m => <option key={m.id} value={m.no}>คู่ที่ {m.no} ({m.date})</option>)}
          </select>
        </Field>
        <Field label="ผู้ตัดสิน"><input className="input" value={f.referee ?? ''} onChange={e => set('referee', e.target.value)} /></Field>
        <Field label="ผู้ช่วยผู้ตัดสิน 1"><input className="input" value={f.assistant1 ?? ''} onChange={e => set('assistant1', e.target.value)} /></Field>
        <Field label="ผู้ช่วยผู้ตัดสิน 2"><input className="input" value={f.assistant2 ?? ''} onChange={e => set('assistant2', e.target.value)} /></Field>
        <div className="col-span-2"><Field label="สรุปผลการแข่งขัน"><input className="input" value={f.summary ?? ''} onChange={e => set('summary', e.target.value)} /></Field></div>
        <div className="col-span-2"><Field label="เหตุการณ์สำคัญ / ข้อร้องเรียน"><textarea className="input min-h-20" value={f.incidents ?? ''} onChange={e => set('incidents', e.target.value)} /></Field></div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>ปิด</button>
        <button className="btn-gold" onClick={() => {
          if (!f.matchNo || !f.referee?.trim()) return;
          update(s => ({ ...s, reports: [...s.reports, { id: uid(), assistant1: '', assistant2: '', summary: '', incidents: '', ...f } as RefereeReport] }));
        }}>เพิ่มรายงาน</button>
      </div>
    </Modal>
  );
}

function ShiftModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, update } = useStore();
  const [f, setF] = useState<Partial<StaffShift>>({});
  const [init, setInit] = useState(false);
  if (open && !init) { setInit(true); setF({ date: todayTH(), venue: 'สนามกีฬาเทศบาลเมืองกันตัง' }); }
  if (!open) { if (init) setInit(false); return null; }
  const set = (k: keyof StaffShift, v: unknown) => setF(x => ({ ...x, [k]: v }));

  return (
    <Modal open onClose={onClose} title="ลงเวลาเจ้าหน้าที่ (หมวด 2)" wide>
      <div className="mb-4 max-h-40 space-y-1 overflow-y-auto rounded-xl bg-white p-3 text-xs">
        {state.shifts.length === 0 && <span className="text-[#8a8270]">ยังไม่มีการลงเวลา</span>}
        {state.shifts.map(sh => (
          <div key={sh.id} className="flex items-center justify-between border-b border-[#f1ecdf] py-1 last:border-0">
            <span>{sh.date} — {sh.name} ({sh.role}) {sh.checkIn}-{sh.checkOut}</span>
            <button className="text-[#b3372b]" onClick={() => update(s => ({ ...s, shifts: s.shifts.filter(x => x.id !== sh.id) }))}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="วันที่"><input className="input" value={f.date ?? ''} onChange={e => set('date', e.target.value)} /></Field>
        <Field label="ชื่อเจ้าหน้าที่"><input className="input" value={f.name ?? ''} onChange={e => set('name', e.target.value)} /></Field>
        <Field label="หน้าที่">
          <select className="input" value={f.role ?? ''} onChange={e => set('role', e.target.value)}>
            <option value="">— เลือก —</option>
            {['ผู้ตัดสิน', 'ผู้ช่วยผู้ตัดสิน', 'ผู้ควบคุมการแข่งขัน', 'เจ้าหน้าที่บันทึกผล', 'เจ้าหน้าที่การเงิน', 'เจ้าหน้าที่สนาม', 'ประชาสัมพันธ์'].map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="สนาม">
          <select className="input" value={f.venue} onChange={e => set('venue', e.target.value)}>
            <option>สนามกีฬาเทศบาลเมืองกันตัง</option><option>สนามกีฬาศรีกันตัง</option>
          </select>
        </Field>
        <Field label="เวลาเข้า"><input type="time" className="input" value={f.checkIn ?? ''} onChange={e => set('checkIn', e.target.value)} /></Field>
        <Field label="เวลาออก"><input type="time" className="input" value={f.checkOut ?? ''} onChange={e => set('checkOut', e.target.value)} /></Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>ปิด</button>
        <button className="btn-gold" onClick={() => {
          if (!f.name?.trim() || !f.role) return;
          update(s => ({ ...s, shifts: [...s.shifts, { id: uid(), checkIn: '-', checkOut: '-', ...f } as StaffShift] }));
        }}>บันทึกลงเวลา</button>
      </div>
    </Modal>
  );
}

function SubModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, update } = useStore();
  const [f, setF] = useState<Partial<Substitution>>({});
  const [init, setInit] = useState(false);
  if (open && !init) { setInit(true); setF({ createdAt: todayTH() }); }
  if (!open) { if (init) setInit(false); return null; }
  const set = (k: keyof Substitution, v: unknown) => setF(x => ({ ...x, [k]: v }));

  return (
    <Modal open onClose={onClose} title="ออกใบเปลี่ยนตัวนักกีฬา (หมวด 4)" wide>
      <div className="mb-4 max-h-40 space-y-1 overflow-y-auto rounded-xl bg-white p-3 text-xs">
        {state.subs.length === 0 && <span className="text-[#8a8270]">ยังไม่มีใบเปลี่ยนตัว</span>}
        {state.subs.map(sb => (
          <div key={sb.id} className="flex items-center justify-between border-b border-[#f1ecdf] py-1 last:border-0">
            <span>คู่ที่ {sb.matchNo} — {state.teams.find(t => t.id === sb.teamId)?.name}: {sb.outPlayer} ➜ {sb.inPlayer} (น.{sb.minute})</span>
            <button className="text-[#b3372b]" onClick={() => update(s => ({ ...s, subs: s.subs.filter(x => x.id !== sb.id) }))}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="คู่ที่">
          <select className="input" value={f.matchNo ?? ''} onChange={e => set('matchNo', +e.target.value)}>
            <option value="">— เลือก —</option>
            {state.matches.map(m => <option key={m.id} value={m.no}>คู่ที่ {m.no} ({m.date} • {CUP_LABEL[m.cup]})</option>)}
          </select>
        </Field>
        <Field label="ทีม">
          <select className="input" value={f.teamId ?? ''} onChange={e => set('teamId', e.target.value)}>
            <option value="">— เลือก —</option>
            {state.teams.map(t => <option key={t.id} value={t.id}>{CUP_LABEL[t.cup]}: {t.name}</option>)}
          </select>
        </Field>
        <Field label="ผู้เล่นออก"><input className="input" value={f.outPlayer ?? ''} onChange={e => set('outPlayer', e.target.value)} /></Field>
        <Field label="ผู้เล่นเข้า"><input className="input" value={f.inPlayer ?? ''} onChange={e => set('inPlayer', e.target.value)} /></Field>
        <Field label="นาทีที่"><input className="input" value={f.minute ?? ''} onChange={e => set('minute', e.target.value)} /></Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>ปิด</button>
        <button className="btn-gold" onClick={() => {
          if (!f.matchNo || !f.teamId || !f.outPlayer?.trim() || !f.inPlayer?.trim()) return;
          update(s => ({ ...s, subs: [...s.subs, { id: uid(), minute: '-', ...f } as Substitution] }));
        }}>ออกใบเปลี่ยนตัว</button>
      </div>
    </Modal>
  );
}
