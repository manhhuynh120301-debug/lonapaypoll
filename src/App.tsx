
import React, { useState, useMemo, useEffect } from 'react';
import { EMPLOYEES, INITIAL_ATTENDANCE, CONSTANTS } from './constants';
import { AttendanceInput, CalculationResult } from './types';
import { formatCurrency } from './utils';
import InfoCard from './components/InfoCard';

const App: React.FC = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(EMPLOYEES[0].id);
  const [customBaseSalary, setCustomBaseSalary] = useState<number>(EMPLOYEES[0].baseSalary);
  const [attendance, setAttendance] = useState<AttendanceInput>(INITIAL_ATTENDANCE);

  // Update base salary when employee selection changes
  useEffect(() => {
    const emp = EMPLOYEES.find(e => e.id === selectedEmployeeId);
    if (emp) {
      setCustomBaseSalary(emp.baseSalary);
    }
  }, [selectedEmployeeId]);

  const results = useMemo((): CalculationResult => {
    const adjBase = customBaseSalary - CONSTANTS.SALARY_SUBTRACTOR;
    
    // Section 2 Logic
    const dailyRate = adjBase / CONSTANTS.WORKING_DAYS;
    const otWeekdayRate = (dailyRate / 8) * CONSTANTS.OT_WEEKDAY_MULTIPLIER;
    const otSundayRate = (dailyRate / 8) * CONSTANTS.OT_SUNDAY_MULTIPLIER;
    const nightShiftRate = dailyRate * CONSTANTS.NIGHT_SHIFT_BONUS_RATE;

    // Section 3 Logic
    const insurance = adjBase * CONSTANTS.INSURANCE_RATE;
    const unionFee = adjBase * CONSTANTS.UNION_RATE;

    // Section 4 Logic
    const dayPhepUnitRate = dailyRate + CONSTANTS.MEAL_ALLOWANCE_PER_DAY;

    const amounts = {
      ngayCong: attendance.ngayCong * dailyRate,
      tienAn: attendance.ngayCong * CONSTANTS.MEAL_ALLOWANCE_PER_DAY,
      ngayPhep: attendance.ngayPhep * dayPhepUnitRate,
      ngoaiGioThuong: attendance.ngoaiGioThuong * otWeekdayRate,
      ngoaiGioChuNhat: attendance.ngoaiGioChuNhat * otSundayRate,
      ca3: attendance.ca3 * nightShiftRate,
    };

    const totalIncome = Object.values(amounts).reduce((a, b) => a + b, 0);
    const netSalary = totalIncome - (insurance + unionFee);

    return {
      dailyRate,
      otWeekdayRate,
      otSundayRate,
      nightShiftRate,
      insurance,
      unionFee,
      amounts,
      totalIncome,
      netSalary
    };
  }, [customBaseSalary, attendance]);

  // Rule: Display net salary as 0 if no attendance data or total income is 0
  const displayNetSalary = results.totalIncome > 0 ? results.netSalary : 0;
  const hasValidData = results.totalIncome > 0;

  const handleAttendanceChange = (field: keyof AttendanceInput, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAttendance(prev => ({ ...prev, [field]: numValue }));
  };

  const handleBaseSalaryChange = (value: string) => {
    const numValue = parseInt(value.replace(/\D/g, '')) || 0;
    setCustomBaseSalary(numValue);
  };

  const handleResetAttendance = () => {
    setAttendance(INITIAL_ATTENDANCE);
  };

  return (
    <div className="mobile-container p-4 flex flex-col gap-6 pb-12">
      {/* SECTION 1: HEADER & NEON EMPLOYEE SELECTION */}
      <header className="pt-6 flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-white neon-text-blue italic uppercase">
            Lona<span className="text-blue-500">Payroll</span>
          </h1>
          <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.25em] mt-1.5 opacity-100">
            Kiên trì là chìa khóa mở mọi cánh cửa
          </p>
        </div>

        {/* Custom Styled Neon Dropdown Card */}
        <div className="bg-slate-900 border border-blue-500/40 rounded-3xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.15)] space-y-5 transition-all duration-500">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhân Viên</label>
            </div>
            <div className="relative group">
              <select 
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 text-blue-400 font-bold rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none text-base shadow-inner group-hover:border-slate-700"
              >
                {EMPLOYEES.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 opacity-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lương Cơ Bản</label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={customBaseSalary ? new Intl.NumberFormat('vi-VN').format(customBaseSalary) : ''}
                onChange={(e) => handleBaseSalaryChange(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 text-emerald-400 font-mono font-bold rounded-2xl px-5 py-4 pr-12 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-base shadow-inner"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-lg pointer-events-none italic">đ</span>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2 & 3: SIDE-BY-SIDE CARDS (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Thu nhập" accentColor="blue">
          <div className="flex flex-col gap-3.5">
            <FullRow label="Lương khoán (ngày)" value={results.dailyRate} />
            <FullRow label="Ngoài giờ thường" value={results.otWeekdayRate} />
            <FullRow label="Ngoài giờ chủ nhật" value={results.otSundayRate} />
            <FullRow label="Ca 3" value={results.nightShiftRate} />
          </div>
        </InfoCard>

        <InfoCard title="Khấu trừ" accentColor="purple">
          <div className="flex flex-col gap-3.5">
            <FullRow label="BHXH + BHYT + BHTN" value={results.insurance} isNegative />
            <FullRow label="Công đoàn phí" value={results.unionFee} isNegative />
          </div>
        </InfoCard>
      </div>

      {/* SECTION 4: ATTENDANCE */}
      <InfoCard 
        title="CHẤM CÔNG CHI TIẾT" 
        accentColor="emerald"
        headerAction={
          <button 
            onClick={handleResetAttendance}
            className="text-[9px] font-black text-emerald-500 border border-emerald-500/40 rounded-full px-3 py-1 bg-emerald-500/5 hover:bg-emerald-500/10 active:scale-95 transition-all uppercase tracking-tighter"
          >
            Tạo lại
          </button>
        }
      >
        <div className="space-y-1">
          <TableHeader />
          <InputRow 
            label="Ngày công" 
            value={attendance.ngayCong} 
            amount={results.amounts.ngayCong}
            onChange={(v) => handleAttendanceChange('ngayCong', v)}
          />
          <div className="flex items-center py-2.5 border-b border-slate-800/60 px-2 -mx-2 opacity-75">
            <div className="flex-1">
              <span className="text-[11px] font-bold text-slate-500">Tiền ăn (Hệ thống tự tính)</span>
            </div>
            <div className="w-16 px-1 text-center text-[10px] text-slate-600 font-mono">
              {attendance.ngayCong}
            </div>
            <div className="w-24 text-right">
              <span className="font-mono text-[11px] text-slate-400 font-semibold">
                {formatCurrency(results.amounts.tienAn)}
              </span>
            </div>
          </div>
          <InputRow 
            label="Ngày phép" 
            value={attendance.ngayPhep} 
            amount={results.amounts.ngayPhep}
            onChange={(v) => handleAttendanceChange('ngayPhep', v)}
          />
          <InputRow 
            label="Ngoài giờ thường" 
            value={attendance.ngoaiGioThuong} 
            amount={results.amounts.ngoaiGioThuong}
            onChange={(v) => handleAttendanceChange('ngoaiGioThuong', v)}
          />
          <InputRow 
            label="Ngoài giờ chủ nhật" 
            value={attendance.ngoaiGioChuNhat} 
            amount={results.amounts.ngoaiGioChuNhat}
            onChange={(v) => handleAttendanceChange('ngoaiGioChuNhat', v)}
          />
          <InputRow 
            label="Ca 3" 
            value={attendance.ca3} 
            amount={results.amounts.ca3}
            onChange={(v) => handleAttendanceChange('ca3', v)}
          />
        </div>
      </InfoCard>

      {/* SECTION 5: SUMMARY */}
      <div className="mt-4 mb-8">
        <div className={`bg-slate-900 border-2 rounded-[2.5rem] p-7 transition-all duration-700 shadow-2xl relative overflow-hidden ${hasValidData ? 'border-pink-500/60 shadow-[0_0_50px_rgba(236,72,153,0.2)]' : 'border-slate-800'}`}>
           <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Tổng Thu Nhập</span>
                <span className={`text-md font-mono font-bold tracking-tight transition-colors ${hasValidData ? 'text-emerald-400' : 'text-slate-600'}`}>{formatCurrency(results.totalIncome)}</span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Tổng Khấu Trừ</span>
                <span className={`text-md font-mono font-bold tracking-tight transition-colors ${hasValidData ? 'text-rose-500' : 'text-slate-600'}`}>-{formatCurrency(results.insurance + results.unionFee)}</span>
              </div>
           </div>

           <div className="flex flex-col items-center pt-6 border-t-2 border-slate-800/80">
              <span className={`text-[11px] font-black uppercase tracking-[0.5em] mb-4 transition-all duration-700 ${hasValidData ? 'text-pink-400 neon-text-pink animate-pulse' : 'text-slate-700'}`}>Số tiền thực nhận</span>
              <div className={`text-5xl font-black font-mono tracking-tighter transition-all duration-700 ${hasValidData ? 'text-white neon-glow-pink scale-110' : 'text-slate-700'}`}>
                {hasValidData ? formatCurrency(displayNetSalary) : '—'}
              </div>
           </div>
        </div>
      </div>

      <footer className="text-center opacity-30 py-6 mt-auto">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">
          LonaPayroll • 2026
        </p>
      </footer>
    </div>
  );
};

// HELPER COMPONENTS
const FullRow: React.FC<{ label: string; value: number; isNegative?: boolean }> = ({ label, value, isNegative }) => (
  <div className="flex justify-between items-center gap-2">
    <span className="text-slate-400 text-[11px] font-bold leading-none">{label}</span>
    <span className={`font-mono text-[12px] whitespace-nowrap ${isNegative ? 'text-rose-400' : 'text-blue-400'} font-black text-right`}>
      {isNegative ? '-' : ''}{formatCurrency(value)}
    </span>
  </div>
);

const TableHeader: React.FC = () => (
  <div className="flex items-center pb-2.5 border-b-2 border-slate-800 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
    <div className="flex-1">Khoản mục chi tiết</div>
    <div className="w-16 text-center">Số lượng</div>
    <div className="w-24 text-right">Thành tiền</div>
  </div>
);

const InputRow: React.FC<{ 
  label: string; 
  value: number; 
  amount: number; 
  onChange: (val: string) => void 
}> = ({ label, value, amount, onChange }) => (
  <div className="flex items-center py-3 border-b border-slate-800/60 px-2 -mx-2 transition-all active:bg-slate-800/40">
    <div className="flex-1">
      <span className="text-[12px] font-bold text-slate-200">{label}</span>
    </div>
    <div className="w-16 px-1">
      <input
        type="number"
        step="0.1"
        value={value || ''}
        placeholder="0"
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-1.5 text-center text-emerald-400 font-mono font-bold text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner"
      />
    </div>
    <div className="w-24 text-right">
      <span className="font-mono text-[12px] text-slate-300 font-bold">
        {formatCurrency(amount)}
      </span>
    </div>
  </div>
);

export default App;
