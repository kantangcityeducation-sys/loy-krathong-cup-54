import { ArrowRight, CalendarDays, CircleAlert, Landmark, Wallet } from 'lucide-react';
import type { ViewKey } from './Shell';
import { computeScorers, computeStandings, fmtBaht, useStore } from '../store';
import { CUP_LABEL, DEPOSIT_AMOUNT, VENUES } from '../types';
import { CupTag, PageHeader, StatCard } from './ui-bits';

export default function Dashboard({ go }: { go: (v: ViewKey) => void }) {
  const { state, fineOf } = useStore();
  const played = state.matches.filter(m => m.played);
  const totalGoals = played.reduce((s, m) => s + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const paidDeposits = state.deposits.filter(d => d.status === 'paid' || d.status === 'refunded');
  const depositCollected = paidDeposits.reduce((s, d) => s + d.amount, 0);
  const fineTotal = state.discipline.reduce((s, d) => s + d.amount, 0);
  const sponsorReceived = state.sponsors.filter(s => s.status === 'received').reduce((s, x) => s + x.amount, 0);
  const sponsorPledged = state.sponsors.filter(s => s.status === 'pledged').reduce((s, x) => s + x.amount, 0);
  const yellows = state.discipline.filter(d => d.type === 'yellow').length;
  const reds = state.discipline.filter(d => d.type === 'red').length;
  const bans = state.discipline.filter(d => d.type === 'ban').length;
  const scorers = computeScorers(state.matches).slice(0, 5);

  const dates = [...new Set(state.matches.map(m => m.date))];
  const firstPendingDay = dates.find(d => state.matches.some(m => m.date === d && !m.played));
  const dayMatches = state.matches.filter(m => m.date === firstPendingDay);

  const standingsKorA = computeStandings(state.teams, state.matches, 'kor', 'A');

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="แดชบอร์ดภาพรวม"
        desc="สรุปสถานะการแข่งขัน การเงิน และวินัย — อัปเดตเรียลไทม์จากข้อมูลที่บันทึก"
        actions={<button className="btn-gold" onClick={() => go('schedule')}><CalendarDays size={16} /> ลงบันทึกผลวันนี้</button>}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard tone="navy" label="นัดที่แข่งแล้ว" value={`${played.length}/68`} sub="โปรแกรมทั้งหมด" />
        <StatCard tone="navy" label="ประตูรวม" value={totalGoals} sub={played.length ? `เฉลี่ย ${(totalGoals / played.length).toFixed(1)}/นัด` : 'ยังไม่มีผล'} />
        <StatCard tone="green" label="เงินประกันเก็บแล้ว" value={fmtBaht(depositCollected)} sub={`${paidDeposits.length}/39 ทีม`} />
        <StatCard tone="red" label="ค่าปรับสะสม" value={fmtBaht(fineTotal)} sub={`เหลือง ${yellows} • แดง ${reds} • แบน ${bans}`} />
        <StatCard tone="gold" label="สปอนเซอร์รับแล้ว" value={fmtBaht(sponsorReceived)} sub={`คำสัญญาค้าง ${fmtBaht(sponsorPledged)}`} />
        <StatCard tone="navy" label="สนามแข่งขัน" value={`${VENUES.length} สนาม`} sub="เทศบาลฯ & ศรีกันตัง" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* โปรแกรมวันนี้ */}
        <section className="card-soft p-5 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#162638]">
              โปรแกรมนัดถัดไป {firstPendingDay ? `— ${firstPendingDay}` : ''}
            </h2>
            <button className="btn-ghost !py-1.5 text-xs" onClick={() => go('schedule')}>ทั้งหมด <ArrowRight size={13} /></button>
          </div>
          {dayMatches.length === 0 ? (
            <p className="text-sm text-[#8a8270]">แข่งครบทุกนัดแล้ว</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {dayMatches.slice(0, 6).map(m => (
                <div key={m.id} className="rounded-xl border border-[#e6dfcd] bg-[#fbf9f3] p-3">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-[#8a8270]">
                    <span>คู่ที่ {m.no} • {m.time}</span>
                    <CupTag cup={m.cup} />
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm font-semibold text-[#162638]">
                    <span className="truncate">{m.homeId ? state.teams.find(t => t.id === m.homeId)?.name : m.homeLabel}</span>
                    <span className="shrink-0 rounded-lg bg-[#162638] px-2 py-0.5 font-display text-xs text-[#fce1b6]">
                      {m.played ? `${m.homeScore} - ${m.awayScore}` : 'VS'}
                    </span>
                    <span className="truncate text-right">{m.awayId ? state.teams.find(t => t.id === m.awayId)?.name : m.awayLabel}</span>
                  </div>
                  <div className="mt-1 truncate text-[11px] text-[#8a8270]">{m.venue}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* การเงิน */}
        <section className="rounded-2xl bg-[#162638] p-5 text-white shadow-sm">
          <h2 className="font-display text-lg font-bold text-[#fce1b6]">สรุปการเงิน</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <div className="flex justify-between text-xs text-white/60"><span className="inline-flex items-center gap-1"><Wallet size={12}/> เงินประกันทีม</span><span>{fmtBaht(depositCollected)} / {fmtBaht(39 * DEPOSIT_AMOUNT)}</span></div>
              <div className="mt-1 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-[#2e7d5b] to-[#57b98a]" style={{ width: `${(paidDeposits.length / 39) * 100}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/60"><span className="inline-flex items-center gap-1"><Landmark size={12}/> สปอนเซอร์</span><span>{state.sponsors.length} ราย</span></div>
              <div className="mt-1 flex justify-between font-display text-sm"><span>รับแล้ว {fmtBaht(sponsorReceived)}</span><span className="text-[#d9bd85]">คำสัญญา {fmtBaht(sponsorPledged)}</span></div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="flex justify-between text-xs text-white/60"><span className="inline-flex items-center gap-1"><CircleAlert size={12}/> ค่าปรับหักเงินประกัน</span><span>{state.discipline.length} รายการ</span></div>
              <div className="mt-1 font-display text-xl font-bold text-[#f0b7ad]">{fmtBaht(fineTotal)}</div>
            </div>
            <button className="btn-gold w-full" onClick={() => go('finance-deposit')}>เปิดศูนย์การเงิน</button>
          </div>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* ตารางคะแนนตัวอย่าง */}
        <section className="card-soft p-5 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#162638]">ตารางคะแนน — {CUP_LABEL.kor} กลุ่ม A</h2>
            <button className="btn-ghost !py-1.5 text-xs" onClick={() => go('standings')}>ทุกกลุ่ม <ArrowRight size={13} /></button>
          </div>
          <table className="w-full overflow-hidden rounded-xl text-sm">
            <thead>
              <tr className="bg-[#162638]">
                <th className="th-cell">#</th><th className="th-cell">ทีม</th><th className="th-cell text-center">แข่ง</th>
                <th className="th-cell text-center">ช</th><th className="th-cell text-center">ส</th><th className="th-cell text-center">พ</th>
                <th className="th-cell text-center">+/-</th><th className="th-cell text-center">แต้ม</th>
              </tr>
            </thead>
            <tbody>
              {standingsKorA.map((r, i) => (
                <tr key={r.team.id} className="border-b border-[#eee7d6] last:border-0">
                  <td className="td-cell font-bold">{i + 1}</td>
                  <td className="td-cell"><span className="mr-2 inline-block h-3 w-3 rounded-full align-middle" style={{ background: r.team.color }} />{r.team.name}</td>
                  <td className="td-cell text-center">{r.p}</td><td className="td-cell text-center">{r.w}</td>
                  <td className="td-cell text-center">{r.d}</td><td className="td-cell text-center">{r.l}</td>
                  <td className="td-cell text-center">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                  <td className="td-cell text-center font-display text-base font-bold text-[#162638]">{r.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ดาวซัลโว */}
        <section className="card-soft p-5">
          <h2 className="font-display text-lg font-bold text-[#162638]">ผู้นำดาวซัลโว</h2>
          {scorers.length === 0 ? (
            <p className="mt-3 text-sm text-[#8a8270]">ยังไม่มีผู้ทำประตู — บันทึกผลการแข่งขันเพื่อเริ่มจัดอันดับ</p>
          ) : (
            <ol className="mt-3 space-y-2">
              {scorers.map((s, i) => (
                <li key={`${s.player}${i}`} className="flex items-center gap-3 rounded-xl border border-[#eee7d6] bg-[#fbf9f3] px-3 py-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-bold ${i === 0 ? 'bg-[#af915f] text-white' : 'bg-[#162638]/10 text-[#162638]'}`}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{s.player}</div>
                    <div className="truncate text-[11px] text-[#8a8270]">{state.teams.find(t => t.id === s.teamId)?.name ?? '-'}</div>
                  </div>
                  <span className="font-display text-lg font-bold text-[#af915f]">{s.goals}</span>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-4 rounded-xl bg-[#162638] p-3 text-xs text-white/70">
            ทีมที่ถูกปรับสูงสุด: {(() => {
              const ranked = state.teams.map(t => ({ t, f: fineOf(t.id) })).sort((a, b) => b.f - a.f);
              return ranked[0] && ranked[0].f > 0 ? `${ranked[0].t.name} (${fmtBaht(ranked[0].f)})` : 'ยังไม่มีทีมถูกปรับ';
            })()}
          </div>
        </section>
      </div>
    </div>
  );
}
