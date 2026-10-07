import { useState } from 'react';
import { computeScorers, computeStandings, useStore } from '../store';
import type { CupId, GroupId } from '../types';
import { CUP_LABEL } from '../types';
import { EmptyState, PageHeader } from './ui-bits';

const GROUPS: GroupId[] = ['A', 'B', 'C', 'D'];
const CUPS: CupId[] = ['kor', 'khor', 'u17'];

export default function Standings() {
  const { state } = useStore();
  const [cup, setCup] = useState<CupId>('kor');
  const scorers = computeScorers(state.matches.filter(m => m.cup === cup)).slice(0, 10);
  const teamsById = new Map(state.teams.map(t => [t.id, t]));

  return (
    <div className="anim-fade-up">
      <PageHeader title="ตารางคะแนนสะสม" desc="คำนวณอัตโนมัติ ชนะ 3 • เสมอ 1 • แพ้ 0 — อันดับ 1-2 ของแต่ละกลุ่มผ่านเข้ารอบ" />

      <div className="mb-4 inline-flex rounded-full border border-[#d9d2c0] bg-white p-1 no-print">
        {CUPS.map(c => (
          <button key={c} onClick={() => setCup(c)}
            className={`rounded-full px-5 py-2 font-display text-sm font-semibold transition ${cup === c ? 'bg-[#162638] text-[#fce1b6] shadow' : 'text-[#6b6248] hover:text-[#162638]'}`}>
            {CUP_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {GROUPS.map(g => {
          const rows = computeStandings(state.teams, state.matches, cup, g);
          if (rows.length === 0) return null;
          return (
            <section key={g} className="card-soft overflow-hidden">
              <div className="flex items-center justify-between bg-[#162638] px-4 py-3">
                <h3 className="font-display font-bold text-[#fce1b6]">กลุ่ม {g} <span className="ml-1 text-xs font-normal text-white/50">({CUP_LABEL[cup]})</span></h3>
                <span className="text-[11px] text-white/50">อันดับ 1-2 ผ่านเข้ารอบ</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f1ecdf] text-[11px] uppercase tracking-wide text-[#6b6248]">
                    <th className="px-3 py-2 text-left">#</th><th className="px-3 py-2 text-left">ทีม</th>
                    <th className="px-2 py-2">แข่ง</th><th className="px-2 py-2">ช</th><th className="px-2 py-2">ส</th><th className="px-2 py-2">พ</th>
                    <th className="px-2 py-2">ได้</th><th className="px-2 py-2">เสีย</th><th className="px-2 py-2">ต่าง</th><th className="px-2 py-2">แต้ม</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.team.id} className={`border-b border-[#eee7d6] last:border-0 ${i < 2 ? 'bg-[#af915f]/8' : ''}`}>
                      <td className="px-3 py-2 font-bold">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${i < 2 ? 'bg-[#af915f] text-white' : 'bg-[#162638]/10 text-[#162638]'}`}>{i + 1}</span>
                      </td>
                      <td className="px-3 py-2 font-semibold"><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: r.team.color }} />{r.team.name}</td>
                      <td className="px-2 py-2 text-center">{r.p}</td><td className="px-2 py-2 text-center">{r.w}</td>
                      <td className="px-2 py-2 text-center">{r.d}</td><td className="px-2 py-2 text-center">{r.l}</td>
                      <td className="px-2 py-2 text-center">{r.gf}</td><td className="px-2 py-2 text-center">{r.ga}</td>
                      <td className="px-2 py-2 text-center">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                      <td className="px-2 py-2 text-center font-display text-base font-bold text-[#162638]">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>

      {/* ดาวซัลโว */}
      <section className="card-soft mt-6 p-5">
        <h3 className="font-display text-lg font-bold text-[#162638]">อันดับดาวซัลโว — {CUP_LABEL[cup]}</h3>
        {scorers.length === 0 ? <div className="mt-3"><EmptyState text="ยังไม่มีผู้ทำประตูในถ้วยนี้" /></div> : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead><tr className="bg-[#f1ecdf] text-left text-[11px] uppercase tracking-wide text-[#6b6248]">
                <th className="px-3 py-2">#</th><th className="px-3 py-2">ผู้เล่น</th><th className="px-3 py-2">ทีม</th><th className="px-3 py-2 text-center">ประตู</th>
              </tr></thead>
              <tbody>
                {scorers.map((s, i) => (
                  <tr key={i} className="border-b border-[#eee7d6] last:border-0">
                    <td className="px-3 py-2 font-bold">{i + 1}</td>
                    <td className="px-3 py-2 font-semibold">{s.player}</td>
                    <td className="px-3 py-2 text-[#6b6248]">{teamsById.get(s.teamId)?.name ?? '-'}</td>
                    <td className="px-3 py-2 text-center font-display font-bold text-[#af915f]">{s.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
