import React from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const SummaryCards = ({ totalBalance, totalIncome, totalExpense }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Balance Card */}
      <div className="glass-panel relative overflow-hidden group hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-950/20 duration-300">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-all duration-500"></div>
        
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              ยอดเงินคงเหลือทั้งหมด
            </span>
            <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20 text-cyan-400">
              <Wallet size={20} />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-1">
              ฿{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              ยอดเงินสุทธิที่ใช้งานได้ขณะนี้
            </p>
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div className="glass-panel relative overflow-hidden group hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-950/20 duration-300">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/15 transition-all duration-500"></div>
        
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              รายรับสะสมเดือนนี้
            </span>
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <TrendingUp size={20} />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-emerald-400 tracking-tight mb-1">
              ฿{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              รายได้รวมตามตัวกรองปัจจุบัน
            </p>
          </div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="glass-panel relative overflow-hidden group hover:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-950/20 duration-300">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/15 transition-all duration-500"></div>
        
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              รายจ่ายสะสมเดือนนี้
            </span>
            <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20 text-rose-400">
              <TrendingDown size={20} />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-rose-400 tracking-tight mb-1">
              ฿{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              รายจ่ายรวมตามตัวกรองปัจจุบัน
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SummaryCards;