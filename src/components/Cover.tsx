import { ArrowRight, CalendarDays, Coins, HandCoins, Printer, ShieldCheck, Trophy, Users } from 'lucide-react';
import { EVENT_INFO } from '../data/seed';
import { useStore } from '../store';

function Krathong({ scale = 1, delay = 0, duration = 60, top = '72%' }: { scale?: number; delay?: number; duration?: number; top?: string }) {
  return (
    <div className="pointer-events-none absolute left-0 anim-drift" style={{ top, animationDuration: `${duration}s`, animationDelay: `${-delay}s` }}>
      <div className="anim-krathong" style={{ transform: `scale(${scale})` }}>
        <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
          <ellipse className="anim-ripple" cx="60" cy="76" rx="34" ry="6" stroke="#c6a76e" strokeOpacity="0.35" strokeWidth="1.5" />
          <ellipse cx="60" cy="76" rx="30" ry="5" fill="#0b1522" fillOpacity="0.55" />
          <path d="M18 62 Q60 44 102 62 Q96 74 60 76 Q24 74 18 62 Z" fill="#3f5d3a" />
          <path d="M24 60 Q60 47 96 60 Q90 70 60 71 Q30 70 24 60 Z" fill="#547a4a" />
          <path d="M32 58 Q60 49 88 58 Q82 66 60 67 Q38 66 32 58 Z" fill="#6c9560" />
          {[-36, -18, 0, 18, 36].map((dx, i) => (
            <path key={i} d={`M${60 + dx} 58 q3 -14 0 -20 q-3 6 0 20`} fill="#e8c37e" opacity={0.9 - Math.abs(dx) / 60} />
          ))}
          <rect x="57" y="34" width="6" height="16" rx="2" fill="#fce1b6" />
          <ellipse className="anim-flicker" cx="60" cy="28" rx="5" ry="9" fill="#ffb84d" />
          <ellipse className="anim-flicker" cx="60" cy="30" rx="2.4" ry="4.5" fill="#fff3d6" style={{ animationDelay: '0.4s' }} />
          <circle cx="44" cy="56" r="4" fill="#d98ba6" />
          <circle cx="76" cy="56" r="4" fill="#d98ba6" />
          <circle cx="44" cy="56" r="1.6" fill="#fce1b6" />
          <circle cx="76" cy="56" r="1.6" fill="#fce1b6" />
        </svg>
      </div>
    </div>
  );
}

function Moon() {
  return (
    <div className="pointer-events-none absolute right-[12%] top-[10%]">
      <div className="anim-glow rounded-full">
        <svg width="92" height="92" viewBox="0 0 92 92">
          <circle cx="46" cy="46" r="38" fill="#f3e5c3" />
          <circle cx="36" cy="38" r="7" fill="#e2d1a8" opacity="0.7" />
          <circle cx="56" cy="52" r="5" fill="#e2d1a8" opacity="0.6" />
          <circle cx="48" cy="30" r="4" fill="#e2d1a8" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function Stars() {
  const stars = [
    [8, 12, 1.2], [18, 30, 0.6], [28, 8, 0.9], [38, 22, 2.1], [52, 10, 1.5],
    [64, 26, 0.4], [76, 6, 1.8], [88, 20, 0.8], [12, 44, 2.4], [70, 40, 1.0],
  ] as const;
  return (
    <>
      {stars.map(([x, y, d], i) => (
        <span key={i} className="anim-star absolute rounded-full bg-[#fce1b6]"
          style={{ left: `${x}%`, top: `${y}%`, width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, animationDelay: `${d}s` }} />
      ))}
    </>
  );
}

const MODULES = [
  { icon: Trophy, title: 'จัดการการแข่งขัน', desc: 'โปรแกรม 68 นัด • บันทึกผลสด • ตารางคะแนนอัตโนมัติ 3 ถ้วย 4 สาย' },
  { icon: Coins, title: 'เงินประกัน & ค่าปรับ', desc: 'ประกัน 3,000 ฿/ทีม • ใบเหลือง-แดงหักอัตโนมัติ • คืนเงินประกัน' },
  { icon: HandCoins, title: 'สปอนเซอร์ผู้สนับสนุน', desc: 'ทะเบียนสปอนเซอร์ 5 ระดับ • ยอดรับจริง/คำสัญญา • สรุปรายรับ' },
  { icon: Printer, title: 'เอกสาร 4 หมวด', desc: 'รายงานผู้ตัดสิน • ใบลงเวลา • ใบเปลี่ยนตัว • ตรวจคุณสมบัติ พร้อมพิมพ์' },
];

export default function Cover({ onEnter }: { onEnter: () => void }) {
  const { state } = useStore();
  const played = state.matches.filter(m => m.played).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1522] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d18] via-[#101d2e] to-[#1a2f45]" />
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-[#14283c] to-[#050b14]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute inset-x-0 h-px bg-[#c6a76e]/10" style={{ top: `${12 + i * 18}%` }} />
        ))}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#c6a76e]/10 to-transparent" />
      </div>
      <Stars />
      <Moon />
      <Krathong scale={1.15} delay={6} duration={74} top="70%" />
      <Krathong scale={0.8} delay={30} duration={88} top="80%" />
      <Krathong scale={0.55} delay={52} duration={64} top="63%" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-10 text-center">
        <div className="anim-fade-up relative mb-8 h-28 w-28" style={{ animationDelay: '0.05s' }}>
          <svg viewBox="0 0 100 100" className="anim-rotate-ring absolute inset-0 h-full w-full">
            <defs><path id="ringPath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
            <text fill="#c6a76e" fontSize="9.5" letterSpacing="2.5" fontFamily="Kanit">
              <textPath href="#ringPath">LOY KRATONG CUP • 54th • KANTANG • 2569 •</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#c6a76e]/50 bg-[#162638]">
            <Trophy size={28} className="text-[#d9bd85]" />
          </div>
        </div>

        <p className="anim-fade-up text-sm font-medium tracking-[0.3em] text-[#c6a76e]" style={{ animationDelay: '0.15s' }}>
          {EVENT_INFO.host}
        </p>
        <h1 className="anim-fade-up mt-3 font-ceremony text-5xl leading-tight text-transparent md:text-7xl bg-clip-text bg-gradient-to-b from-[#fce1b6] via-[#d9bd85] to-[#af915f]"
          style={{ animationDelay: '0.25s' }}>
          ลอยกระทงคัพ ครั้งที่ 54
        </h1>
        <p className="anim-fade-up mt-3 font-display text-lg text-white/85 md:text-xl" style={{ animationDelay: '0.35s' }}>
          ระบบบริหารจัดการการแข่งขัน & การเงินแบบครบวงจร — {EVENT_INFO.year}
        </p>

        <div className="anim-fade-up mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70" style={{ animationDelay: '0.45s' }}>
          <span className="chip border border-white/20 bg-white/5"><CalendarDays size={13} /> {EVENT_INFO.period}</span>
          <span className="chip border border-white/20 bg-white/5"><Users size={13} /> 39 ทีม • 3 ถ้วย • 14 อปท.</span>
          <span className="chip border border-white/20 bg-white/5"><ShieldCheck size={13} /> ประกัน {EVENT_INFO.depositPerTeam.toLocaleString()} ฿/ทีม</span>
        </div>

        <button onClick={onEnter}
          className="anim-fade-up group mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#d9bd85] to-[#af915f] px-8 py-4 font-display text-lg font-bold text-[#101d2e] shadow-[0_10px_40px_rgba(175,145,95,0.45)] transition hover:brightness-110"
          style={{ animationDelay: '0.55s' }}>
          เข้าสู่ระบบจัดการ
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </button>
        {played > 0 && (
          <p className="anim-fade-up mt-3 text-xs text-[#c6a76e]" style={{ animationDelay: '0.6s' }}>
            มีข้อมูลการแข่งขันแล้ว {played} นัด — ระบบจะโหลดข้อมูลเดิมของเครื่องนี้ต่อให้อัตโนมัติ
          </p>
        )}

        <div className="anim-fade-up mt-12 grid w-full grid-cols-1 gap-3 sm:grid-cols-2" style={{ animationDelay: '0.7s' }}>
          {MODULES.map((m) => (
            <div key={m.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-sm transition hover:border-[#c6a76e]/40 hover:bg-white/[0.07]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c6a76e]/15 text-[#d9bd85]">
                <m.icon size={20} />
              </div>
              <div>
                <div className="font-display font-semibold text-[#fce1b6]">{m.title}</div>
                <div className="mt-0.5 text-xs leading-relaxed text-white/60">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-auto pt-10 text-xs text-white/40">
          ประธานจัดการแข่งขัน: {EVENT_INFO.chairman} • สนามกีฬาเทศบาลเมืองกันตัง & สนามกีฬาศรีกันตัง • {EVENT_INFO.version}
        </footer>
      </div>
    </div>
  );
}
