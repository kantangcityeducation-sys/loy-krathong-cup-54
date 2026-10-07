import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  CupId, Deposit, DisciplineRecord, EligibilityCheck, GroupId, Match,
  RefereeReport, Sponsor, StaffShift, Substitution, Team,
} from './types';
import { CUP_LABEL, DEPOSIT_AMOUNT } from './types';
import { buildMatches, buildTeams, ORGS, SEED_DISCIPLINE, SEED_SPONSORS } from './data/seed';

const LS_KEY = 'lkcup54-state-v1';

export interface AppState {
  teams: Team[];
  matches: Match[];
  discipline: DisciplineRecord[];
  deposits: Deposit[];
  sponsors: Sponsor[];
  reports: RefereeReport[];
  shifts: StaffShift[];
  subs: Substitution[];
  eligibility: EligibilityCheck[];
}

function freshState(): AppState {
  const teams = buildTeams();
  return {
    teams,
    matches: buildMatches(teams),
    discipline: SEED_DISCIPLINE,
    deposits: teams.map(t => ({ teamId: t.id, amount: DEPOSIT_AMOUNT, status: 'unpaid' })),
    sponsors: SEED_SPONSORS,
    reports: [],
    shifts: [],
    subs: [],
    eligibility: ORGS.map(org => ({ org, checked: false })),
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.teams?.length || !parsed.matches?.length) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

// ---------- Derived ----------
export interface StandingRow {
  team: Team; p: number; w: number; d: number; l: number;
  gf: number; ga: number; gd: number; pts: number;
}

export function computeStandings(teams: Team[], matches: Match[], cup: CupId, group: GroupId): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  teams.filter(t => t.cup === cup && t.group === group).forEach(t =>
    rows.set(t.id, { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }));
  matches.filter(m => m.played && m.cup === cup && m.group === group && m.round === 'group').forEach(m => {
    const h = rows.get(m.homeId ?? ''); const a = rows.get(m.awayId ?? '');
    if (!h || !a) return;
    const hs = m.homeScore ?? 0; const as = m.awayScore ?? 0;
    h.p++; a.p++; h.gf += hs; h.ga += as; a.gf += as; a.ga += hs;
    if (hs > as) { h.w++; a.l++; h.pts += 3; }
    else if (hs < as) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  });
  return [...rows.values()].map(r => ({ ...r, gd: r.gf - r.ga }))
    .sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
}

export function computeScorers(matches: Match[]): { player: string; teamId: string; goals: number }[] {
  const map = new Map<string, { player: string; teamId: string; goals: number }>();
  matches.forEach(m => m.goals.forEach(g => {
    const key = `${g.player}|${g.teamId}`;
    const cur = map.get(key) ?? { player: g.player, teamId: g.teamId, goals: 0 };
    cur.goals += 1;
    map.set(key, cur);
  }));
  return [...map.values()].sort((a, b) => b.goals - a.goals);
}

export function teamFine(discipline: DisciplineRecord[], teamId: string): number {
  return discipline.filter(d => d.teamId === teamId).reduce((s, d) => s + d.amount, 0);
}

// ---------- Context ----------
interface StoreCtx {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  resetAll: () => void;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<void>;
  teamById: (id: string | null | undefined) => Team | undefined;
  depositOf: (teamId: string) => Deposit;
  fineOf: (teamId: string) => number;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* quota */ }
  }, [state]);

  const value = useMemo<StoreCtx>(() => ({
    state,
    update: fn => setState(prev => fn(prev)),
    resetAll: () => {
      if (window.confirm('ยืนยันรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น?')) setState(freshState());
    },
    exportJSON: () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ลอยกระทงคัพ54-สำรองข้อมูล-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    importJSON: async (file: File) => {
      const text = await file.text();
      const parsed = JSON.parse(text) as AppState;
      if (!parsed.teams || !parsed.matches) throw new Error('ไฟล์ไม่ถูกต้อง');
      setState(parsed);
    },
    teamById: id => state.teams.find(t => t.id === id),
    depositOf: teamId => state.deposits.find(d => d.teamId === teamId) ?? { teamId, amount: DEPOSIT_AMOUNT, status: 'unpaid' },
    fineOf: teamId => teamFine(state.discipline, teamId),
  }), [state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export const fmtBaht = (n: number) => `${n.toLocaleString('th-TH')} ฿`;
export const cupLabel = (c: CupId) => CUP_LABEL[c];

export const uid = () => Math.random().toString(36).slice(2, 9);
