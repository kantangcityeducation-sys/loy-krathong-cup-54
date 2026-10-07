import { useRef, useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { StoreProvider, useStore } from './store';
import Cover from './components/Cover';
import Shell, { type ViewKey } from './components/Shell';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import Standings from './components/Standings';
import Teams from './components/Teams';
import { DepositView, FineView, SponsorView } from './components/Finance';
import Documents from './components/Documents';

function BackupStrip() {
  const { exportJSON, importJSON, resetAll } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-[#cfc7b0] bg-white/50 px-4 py-3 text-xs text-[#8a8270] no-print">
      <span className="font-bold">สำรองข้อมูล:</span>
      <span>ข้อมูลถูกบันทึกอัตโนมัติในเครื่องนี้ — ส่งออกไฟล์สำรองเพื่อย้ายเครื่องหรือเก็บไว้</span>
      <span className="ml-auto flex gap-2">
        <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={exportJSON}><Download size={13} /> ส่งออก JSON</button>
        <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => fileRef.current?.click()}><Upload size={13} /> นำเข้า</button>
        <button className="btn !px-3 !py-1.5 text-xs text-[#b3372b] hover:bg-[#b3372b]/5" onClick={resetAll}><RotateCcw size={13} /> รีเซ็ต</button>
      </span>
      <input ref={fileRef} type="file" accept="application/json" className="hidden"
        onChange={async e => {
          const f = e.target.files?.[0];
          if (f) { try { await importJSON(f); } catch { window.alert('ไฟล์สำรองไม่ถูกต้อง'); } }
          e.target.value = '';
        }} />
    </div>
  );
}

function Main() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<ViewKey>('dashboard');

  if (!entered) return <Cover onEnter={() => setEntered(true)} />;

  return (
    <Shell view={view} setView={setView} onHome={() => setEntered(false)}>
      {view === 'dashboard' && <Dashboard go={setView} />}
      {view === 'schedule' && <Schedule />}
      {view === 'standings' && <Standings />}
      {view === 'teams' && <Teams />}
      {view === 'finance-deposit' && <DepositView />}
      {view === 'finance-fine' && <FineView />}
      {view === 'finance-sponsor' && <SponsorView />}
      {view === 'documents' && <Documents />}
      <BackupStrip />
    </Shell>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Main />
    </StoreProvider>
  );
}
