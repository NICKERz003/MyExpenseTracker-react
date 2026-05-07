import React from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const SummaryCards = ({ totalBalance, totalIncome, totalExpense }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Balance Card */}
      <div className="clay-card bg-gradient-to-br from-[#2c8160] to-[#4ade80] text-white overflow-hidden relative group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Wallet size={24} />
            </div>
            <span className="font-bold uppercase tracking-wider text-sm opacity-80">ยอดเงินคงเหลือ</span>
          </div>
          <h2 className="text-4xl font-black mb-1">฿{totalBalance.toLocaleString()}</h2>
          <p className="text-sm font-medium opacity-70">สรุปยอดเงินปัจจุบันของคุณ</p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      </div>

      {/* Income Card */}
      <div className="clay-card bg-white border-2 border-green-50/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-3 rounded-2xl clay-card-inset !p-3">
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <span className="font-bold uppercase tracking-wider text-sm text-slate-400">รายรับ</span>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-1">฿{totalIncome.toLocaleString()}</h2>
        <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
          <span className="bg-green-100 px-2 py-0.5 rounded-full">+12% จากเดือนที่แล้ว</span>
        </div>
      </div>

      {/* Expense Card */}
      <div className="clay-card bg-white border-2 border-red-50/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-3 rounded-2xl clay-card-inset !p-3">
            <TrendingDown className="text-red-500" size={24} />
          </div>
          <span className="font-bold uppercase tracking-wider text-sm text-slate-400">รายจ่าย</span>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-1">฿{totalExpense.toLocaleString()}</h2>
        <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
          <span className="bg-red-100 px-2 py-0.5 rounded-full">มีการใช้จ่ายมากขึ้น</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;