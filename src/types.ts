// ---------- Core domain types ----------
export type CupId = 'kor' | 'khor' | 'u17';
export type GroupId = 'A' | 'B' | 'C' | 'D';
export type RoundId = 'group' | 'playoff' | 'round2' | 'semi' | 'final';

export interface Team {
  id: string;
  name: string;
  org: string;
  cup: CupId;
  group: GroupId;
  slot: string;
  color: string;
  manager?: string;
  phone?: string;
}

export interface GoalEvent {
  teamId: string;
  player: string;
  minute: string;
}

export interface Match {
  id: string;
  no: number;
  date: string;
  isoDate: string;
  time: string;
  cup: CupId;
  group?: GroupId;
  round: RoundId;
  homeId: string | null;
  awayId: string | null;
  homeLabel: string;
  awayLabel: string;
  venue: string;
  note?: string;
  played: boolean;
  homeScore?: number;
  awayScore?: number;
  goals: GoalEvent[];
}

export type CardType = 'yellow' | 'red' | 'ban';

export interface DisciplineRecord {
  id: string;
  date: string;
  matchNo?: number;
  teamId: string;
  player: string;
  type: CardType;
  amount: number;
  note: string;
}

export type DepositStatus = 'unpaid' | 'paid' | 'refunded';

export interface Deposit {
  teamId: string;
  amount: number;
  status: DepositStatus;
  paidDate?: string;
  receiptNo?: string;
  method?: string;
  note?: string;
}

export type SponsorTier = 'diamond' | 'gold' | 'silver' | 'bronze' | 'support';

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  amount: number;
  inKind?: string;
  contact?: string;
  status: 'pledged' | 'received';
  date?: string;
  note?: string;
}

export interface RefereeReport {
  id: string;
  matchNo: number;
  referee: string;
  assistant1: string;
  assistant2: string;
  fourthOfficial?: string;
  summary: string;
  incidents: string;
  createdAt: string;
}

export interface StaffShift {
  id: string;
  date: string;
  name: string;
  role: string;
  venue: string;
  checkIn: string;
  checkOut: string;
  note?: string;
}

export interface Substitution {
  id: string;
  matchNo: number;
  teamId: string;
  outPlayer: string;
  inPlayer: string;
  minute: string;
  createdAt: string;
}

export interface EligibilityCheck {
  org: string;
  checked: boolean;
  checkedBy?: string;
  checkedAt?: string;
  note?: string;
}

export const CUP_LABEL: Record<CupId, string> = {
  kor: 'ถ้วย ก',
  khor: 'ถ้วย ข',
  u17: 'เยาวชน U17',
};

export const ROUND_LABEL: Record<RoundId, string> = {
  group: 'รอบแรก',
  playoff: 'Play OFF',
  round2: 'รอบสอง',
  semi: 'รอบรองชนะเลิศ',
  final: 'รอบชิงชนะเลิศ',
};

export const TIER_LABEL: Record<SponsorTier, string> = {
  diamond: 'ผู้สนับสนุนหลัก (เพชร)',
  gold: 'สปอนเซอร์ทอง',
  silver: 'สปอนเซอร์เงิน',
  bronze: 'สปอนเซอร์ทองแดง',
  support: 'ผู้ร่วมสนับสนุน',
};

export const FINE_RATE = { yellow: 100, redMin: 300, redMax: 1000 } as const;
export const DEPOSIT_AMOUNT = 3000;

export const VENUES = ['สนามกีฬาเทศบาลเมืองกันตัง', 'สนามกีฬาศรีกันตัง'] as const;
