import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const MonthYearPicker = ({ selectedMonth, selectedYear, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selectedYear);
  const containerRef = useRef(null);

  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMonth = (monthIndex) => {
    onChange(monthIndex, viewYear);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 rounded-2xl text-slate-200 transition-all font-bold px-3 sm:px-4 py-2 sm:py-2.5 min-w-[130px] sm:min-w-[170px] text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={14} className="text-emerald-400 shrink-0" />
          <span>{months[selectedMonth]} {selectedYear + 543}</span>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-[90] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed md:absolute z-[100] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:left-auto md:right-0 md:translate-x-0 md:top-full md:translate-y-0 mt-3 glass-panel bg-slate-950/95 border border-slate-800/80 p-5 shadow-2xl w-[280px] sm:w-[300px] text-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Year Selector */}
            <div className="flex justify-between items-center mb-5">
              <button
                onClick={() => setViewYear(viewYear - 1)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800/80 rounded-xl p-2 transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="text-center">
                <p className="text-base font-black text-white">{viewYear + 543}</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">เลือกปี พ.ศ.</p>
              </div>
              <button
                onClick={() => setViewYear(viewYear + 1)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800/80 rounded-xl p-2 transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleSelectMonth(index)}
                  className={`py-3 rounded-2xl text-xs font-black transition-all cursor-pointer border border-transparent
                    ${selectedMonth === index && selectedYear === viewYear
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-800/50'
                    }`}
                >
                  {month}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-black text-slate-400 hover:text-rose-400 uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthYearPicker;
