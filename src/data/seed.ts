import type {
  CupId, GroupId, Match, RoundId, Sponsor, Team, DisciplineRecord,
} from '../types';

// ---------------- องค์กรปกครองส่วนท้องถิ่น 14 แห่ง อ.กันตัง ----------------
export const ORGS = [
  'เทศบาลเมืองกันตัง', 'ทต.ควนธานี', 'ทต.บางเป้า', 'อบต.เกาะลิบง', 'อบต.นาเกลือ',
  'อบต.บ่อน้ำร้อน', 'อบต.กันตังใต้', 'อบต.บางหมาก', 'อบต.บางสัก', 'อบต.คลองชีล้อม',
  'อบต.ย่านซื่อ', 'อบต.คลองลุ', 'อบต.วังวน', 'อบต.โคกยาง',
];

// ---------------- ทีม 39 ทีม / 3 ถ้วย ----------------
interface TeamSeed { name: string; org: string; cup: CupId; group: GroupId; slot: string; }

const TEAM_SEEDS: TeamSeed[] = [
  // ถ้วย ก (12 ทีม)
  { name: 'อบต.เกาะลิบง', org: 'อบต.เกาะลิบง', cup: 'kor', group: 'A', slot: 'A1' },
  { name: 'มดตะนอย (อบต.เกาะลิบง)', org: 'อบต.เกาะลิบง', cup: 'kor', group: 'A', slot: 'A2' },
  { name: 'เกาะมุกต์ (อบต.เกาะลิบง)', org: 'อบต.เกาะลิบง', cup: 'kor', group: 'A', slot: 'A3' },
  { name: 'อบต.นาเกลือ', org: 'อบต.นาเกลือ', cup: 'kor', group: 'B', slot: 'B1' },
  { name: 'อบต.บ่อน้ำร้อน', org: 'อบต.บ่อน้ำร้อน', cup: 'kor', group: 'B', slot: 'B2' },
  { name: 'เกาะเคี่ยม (อบต.กันตังใต้)', org: 'อบต.กันตังใต้', cup: 'kor', group: 'B', slot: 'B3' },
  { name: 'อบต.บางหมาก', org: 'อบต.บางหมาก', cup: 'kor', group: 'C', slot: 'C1' },
  { name: 'อบต.กันตังใต้', org: 'อบต.กันตังใต้', cup: 'kor', group: 'C', slot: 'C2' },
  { name: 'อบต.บางสัก', org: 'อบต.บางสัก', cup: 'kor', group: 'C', slot: 'C3' },
  { name: 'อบต.คลองชีล้อม', org: 'อบต.คลองชีล้อม', cup: 'kor', group: 'D', slot: 'D1' },
  { name: 'ทต.ควนธานี', org: 'ทต.ควนธานี', cup: 'kor', group: 'D', slot: 'D2' },
  { name: 'ทม.กันตัง', org: 'เทศบาลเมืองกันตัง', cup: 'kor', group: 'D', slot: 'D3' },
  // ถ้วย ข (14 ทีม)
  { name: 'ทต.ควนธานี', org: 'ทต.ควนธานี', cup: 'khor', group: 'A', slot: 'A1' },
  { name: 'ทต.บางเป้า', org: 'ทต.บางเป้า', cup: 'khor', group: 'A', slot: 'A2' },
  { name: 'อบต.ย่านซื่อ', org: 'อบต.ย่านซื่อ', cup: 'khor', group: 'A', slot: 'A3' },
  { name: 'อบต.นาเกลือ', org: 'อบต.นาเกลือ', cup: 'khor', group: 'A', slot: 'A4' },
  { name: 'อบต.คลองลุ', org: 'อบต.คลองลุ', cup: 'khor', group: 'B', slot: 'B1' },
  { name: 'อบต.กันตังใต้', org: 'อบต.กันตังใต้', cup: 'khor', group: 'B', slot: 'B2' },
  { name: 'อบต.บางหมาก', org: 'อบต.บางหมาก', cup: 'khor', group: 'B', slot: 'B3' },
  { name: 'อบต.วังวน', org: 'อบต.วังวน', cup: 'khor', group: 'B', slot: 'B4' },
  { name: 'อบต.บ่อน้ำร้อน', org: 'อบต.บ่อน้ำร้อน', cup: 'khor', group: 'C', slot: 'C1' },
  { name: 'อบต.บางสัก', org: 'อบต.บางสัก', cup: 'khor', group: 'C', slot: 'C2' },
  { name: 'อบต.โคกยาง', org: 'อบต.โคกยาง', cup: 'khor', group: 'C', slot: 'C3' },
  { name: 'อบต.คลองชีล้อม', org: 'อบต.คลองชีล้อม', cup: 'khor', group: 'D', slot: 'D1' },
  { name: 'อบต.เกาะลิบง', org: 'อบต.เกาะลิบง', cup: 'khor', group: 'D', slot: 'D2' },
  { name: 'ทม.กันตัง', org: 'เทศบาลเมืองกันตัง', cup: 'khor', group: 'D', slot: 'D3' },
  // เยาวชน U17 (13 ทีม)
  { name: 'ทต.ควนธานี', org: 'ทต.ควนธานี', cup: 'u17', group: 'A', slot: 'A1' },
  { name: 'ทต.บางเป้า', org: 'ทต.บางเป้า', cup: 'u17', group: 'A', slot: 'A2' },
  { name: 'อบต.นาเกลือ', org: 'อบต.นาเกลือ', cup: 'u17', group: 'A', slot: 'A3' },
  { name: 'อบต.คลองลุ', org: 'อบต.คลองลุ', cup: 'u17', group: 'A', slot: 'A4' },
  { name: 'อบต.บางหมาก', org: 'อบต.บางหมาก', cup: 'u17', group: 'B', slot: 'B1' },
  { name: 'อบต.บ่อน้ำร้อน', org: 'อบต.บ่อน้ำร้อน', cup: 'u17', group: 'B', slot: 'B2' },
  { name: 'อบต.กันตังใต้', org: 'อบต.กันตังใต้', cup: 'u17', group: 'B', slot: 'B3' },
  { name: 'อบต.บางสัก', org: 'อบต.บางสัก', cup: 'u17', group: 'C', slot: 'C1' },
  { name: 'อบต.โคกยาง', org: 'อบต.โคกยาง', cup: 'u17', group: 'C', slot: 'C2' },
  { name: 'อบต.คลองชีล้อม', org: 'อบต.คลองชีล้อม', cup: 'u17', group: 'C', slot: 'C3' },
  { name: 'ทม.กันตัง', org: 'เทศบาลเมืองกันตัง', cup: 'u17', group: 'D', slot: 'D1' },
  { name: 'อบต.เกาะลิบง', org: 'อบต.เกาะลิบง', cup: 'u17', group: 'D', slot: 'D2' },
  { name: 'อบต.วังวน', org: 'อบต.วังวน', cup: 'u17', group: 'D', slot: 'D3' },
];

const SHIRT_COLORS = ['#c0392b', '#2471a3', '#1e8449', '#b9770e', '#7d3c98', '#17a589', '#d35400', '#2e4053', '#af915f', '#884ea0', '#16a085', '#ba4a00'];

export function buildTeams(): Team[] {
  return TEAM_SEEDS.map((t, i) => ({
    id: `${t.cup}-${t.slot}`,
    name: t.name,
    org: t.org,
    cup: t.cup,
    group: t.group,
    slot: t.slot,
    color: SHIRT_COLORS[i % SHIRT_COLORS.length],
  }));
}

// ---------------- โปรแกรม 68 นัด ----------------
const MONTHS_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

function thaiDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}-${MONTHS_TH[m - 1]}-${String((y + 543) % 100).padStart(2, '0')}`;
}

const DAY_OFFSETS = Array.from({ length: 34 }, (_, i) => i); // 22 ต.ค. -> 24 พ.ย.
const TIMES = ['10.00 น.', '14.00 น.', '16.30 น.'];

function isoFromOffset(off: number): string {
  const base = new Date(2026, 9, 22); // 22 ต.ค. 2569
  base.setDate(base.getDate() + off);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(base.getDate()).padStart(2, '0')}`;
}

export function buildMatches(teams: Team[]): Match[] {
  const bySlot = new Map(teams.map(t => [`${t.cup}:${t.slot}`, t]));
  const matches: Match[] = [];
  let no = 1;
  let dayCursor = 0;
  let slotInDay = 0;

  const push = (cup: CupId, group: GroupId | undefined, round: RoundId,
    home: Team | null, away: Team | null, homeLabel: string, awayLabel: string, note?: string) => {
    const off = DAY_OFFSETS[Math.min(dayCursor, DAY_OFFSETS.length - 1)];
    const iso = isoFromOffset(off);
    matches.push({
      id: `m${no}`, no, isoDate: iso, date: thaiDate(iso),
      time: TIMES[slotInDay % TIMES.length],
      cup, group, round,
      homeId: home?.id ?? null, awayId: away?.id ?? null,
      homeLabel, awayLabel,
      venue: (no % 2 === 1) ? 'สนามกีฬาเทศบาลเมืองกันตัง' : 'สนามกีฬาศรีกันตัง',
      note, played: false, goals: [],
    });
    no += 1;
    slotInDay += 1;
    if (slotInDay >= 3) { slotInDay = 0; dayCursor += 1; }
  };

  const groupRoundRobin = (cup: CupId, group: GroupId, slots: string[]) => {
    const ts = slots.map(s => bySlot.get(`${cup}:${s}`)!);
    for (let i = 0; i < ts.length; i++) {
      for (let j = i + 1; j < ts.length; j++) {
        push(cup, group, 'group', ts[i], ts[j], ts[i].name, ts[j].name,
          no === 1 ? 'คู่เปิดสนาม' : undefined);
      }
    }
  };

  // ถ้วย ก — 4 กลุ่มละ 3 ทีม
  groupRoundRobin('kor', 'A', ['A1', 'A2', 'A3']);
  groupRoundRobin('kor', 'B', ['B1', 'B2', 'B3']);
  groupRoundRobin('kor', 'C', ['C1', 'C2', 'C3']);
  groupRoundRobin('kor', 'D', ['D1', 'D2', 'D3']);
  // ถ้วย ข
  groupRoundRobin('khor', 'A', ['A1', 'A2', 'A3', 'A4']);
  groupRoundRobin('khor', 'B', ['B1', 'B2', 'B3', 'B4']);
  groupRoundRobin('khor', 'C', ['C1', 'C2', 'C3']);
  groupRoundRobin('khor', 'D', ['D1', 'D2', 'D3']);
  // U17
  groupRoundRobin('u17', 'A', ['A1', 'A2', 'A3', 'A4']);
  groupRoundRobin('u17', 'B', ['B1', 'B2', 'B3']);
  groupRoundRobin('u17', 'C', ['C1', 'C2', 'C3']);
  groupRoundRobin('u17', 'D', ['D1', 'D2', 'D3']);

  dayCursor += 1; slotInDay = 0;

  const knockout = (cup: CupId, withThird: boolean) => {
    const pairs: [string, string][] = [['อันดับ 1 กลุ่ม A', 'อันดับ 2 กลุ่ม B'], ['อันดับ 1 กลุ่ม B', 'อันดับ 2 กลุ่ม A'], ['อันดับ 1 กลุ่ม C', 'อันดับ 2 กลุ่ม D'], ['อันดับ 1 กลุ่ม D', 'อันดับ 2 กลุ่ม C']];
    pairs.forEach(([h, a], i) => push(cup, undefined, 'playoff', null, null, h, a, `Play OFF คู่ที่ ${i + 1}`));
    push(cup, undefined, 'semi', null, null, 'ผู้ชนะ Play OFF 1', 'ผู้ชนะ Play OFF 2', 'รอบรองฯ คู่ที่ 1');
    push(cup, undefined, 'semi', null, null, 'ผู้ชนะ Play OFF 3', 'ผู้ชนะ Play OFF 4', 'รอบรองฯ คู่ที่ 2');
    if (withThird) push(cup, undefined, 'final', null, null, 'ผู้แพ้รอบรองฯ 1', 'ผู้แพ้รอบรองฯ 2', 'ชิงอันดับ 3');
    push(cup, undefined, 'final', null, null, 'ผู้ชนะรอบรองฯ 1', 'ผู้ชนะรอบรองฯ 2', 'นัดชิงชนะเลิศ');
  };

  knockout('kor', true);
  knockout('khor', true);
  knockout('u17', false);

  return matches.slice(0, 68);
}

// ---------------- ข้อมูลตั้งต้นอื่น ----------------
export const COMMITTEE = [
  { name: 'ชัยวัฒน์', org: 'ทม.กันตัง' }, { name: 'ศรีสุวรรณ', org: 'ทต.ควนธานี' },
  { name: 'สุขสมบูรณ์', org: 'ทต.บางเป้า' }, { name: 'ปานเจริญ', org: 'อบต.เกาะลิบง' },
];

export const SEED_SPONSORS: Sponsor[] = [
  { id: 'sp1', name: 'เทศบาลเมืองกันตัง', tier: 'diamond', amount: 150000, contact: 'สำนักงานเทศบาล', status: 'received', date: '1-ต.ค.-69', note: 'งบสนับสนุนหลัก' },
  { id: 'sp2', name: 'ธนาคารเพื่อการเกษตรฯ สาขากันตัง', tier: 'gold', amount: 50000, contact: 'ผู้จัดการสาขา', status: 'received', date: '8-ต.ค.-69' },
  { id: 'sp3', name: 'การไฟฟ้าส่วนภูมิภาค กันตัง', tier: 'silver', amount: 30000, status: 'pledged', date: '10-ต.ค.-69' },
  { id: 'sp4', name: 'ร้านค้าชุมชนกันตัง', tier: 'support', amount: 5000, inKind: 'น้ำดื่ม 100 แพ็ก', status: 'received', date: '15-ต.ค.-69' },
];

export const SEED_DISCIPLINE: DisciplineRecord[] = [
  { id: 'dc1', date: '22-ต.ค.-69', matchNo: 1, teamId: 'kor-A1', player: 'ประสิทธิ์ ใจดี', type: 'yellow', amount: 100, note: 'ใบเหลือง น.27 ทำฟาวล์รุนแรง' },
  { id: 'dc2', date: '22-ต.ค.-69', matchNo: 1, teamId: 'kor-A2', player: 'อนุชา มั่นคง', type: 'yellow', amount: 100, note: 'ใบเหลือง น.55 ดึงเสื้อคู่แข่ง' },
];

export const EVENT_INFO = {
  title: 'ฟุตบอลลอยกระทงคัพ ครั้งที่ 54',
  year: 'ประจำปี พ.ศ. 2569',
  host: 'เทศบาลเมืองกันตัง ร่วมกับ 13 องค์กรปกครองส่วนท้องถิ่น',
  period: '22 ตุลาคม – 24 พฤศจิกายน 2569',
  chairman: 'นายปุณณภพ ภาษีทวีเกียรติ',
  prizePool: 300000,
  depositPerTeam: 3000,
  version: 'v3.0.0',
};
