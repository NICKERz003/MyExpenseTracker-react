import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarView = ({ transactions, categories }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = Array.from({ length: numDays }, (_, i) => i + 1);
  const padding = Array.from({ length: startDay }, (_, i) => null);

  const getTransactionsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return transactions.filter(t => t.date === dateStr);
  };

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  return (
    <div className="clay-card bg-white h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-slate-800">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="clay-card-inset !p-2 hover:text-[#6C63FF] transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="clay-card-inset !p-2 hover:text-[#6C63FF] transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map(d => (
          <div key={d} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 flex-grow">
        {padding.map((_, i) => <div key={`p-${i}`} className="aspect-square"></div>)}
        {days.map(day => {
          const dayTransactions = getTransactionsForDay(day);
          const income = dayTransactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
          const expense = dayTransactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div 
              key={day} 
              className={`aspect-square clay-card-inset !p-2 flex flex-col justify-between hover:scale-105 transition-all cursor-pointer relative overflow-hidden ${isToday ? 'ring-2 ring-[#6C63FF]' : ''}`}
            >
              <span className={`text-xs font-bold ${isToday ? 'text-[#6C63FF]' : 'text-slate-500'}`}>{day}</span>
              <div className="space-y-1">
                {income > 0 && <div className="h-1.5 w-full bg-[#4ECDC4] rounded-full"></div>}
                {expense > 0 && <div className="h-1.5 w-full bg-[#FF6B6B] rounded-full"></div>}
              </div>
              
              {/* Tooltip-like indicator for total on that day */}
              {(income > 0 || expense > 0) && (
                <div className="absolute top-1 right-1 flex flex-col items-end">
                   {dayTransactions.slice(0, 1).map((t, idx) => (
                     <span key={idx} className="text-[10px] leading-none opacity-80">
                        {categories[t.type].find(c => c.name === t.categoryId)?.emoji}
                     </span>
                   ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-6 text-xs font-bold text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#4ECDC4] rounded-full"></div> รายรับ
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF6B6B] rounded-full"></div> รายจ่าย
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
