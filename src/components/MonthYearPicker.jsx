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
        className="clay-card-inset !p-3 px-6 flex items-center gap-3 text-sm font-black text-slate-700 hover:bg-slate-50 transition-all min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-[#2c8160]" />
          <span>{months[selectedMonth]} {selectedYear + 543}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 z-[100] clay-card bg-white p-6 shadow-2xl w-[300px] animate-in zoom-in-95 fade-in duration-200">
          {/* Year Selector */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setViewYear(viewYear - 1)}
              className="clay-card-inset !p-2 text-slate-400 hover:text-[#2c8160]"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-center">
              <p className="text-lg font-black text-slate-800">{viewYear + 543}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลือกปี พ.ศ.</p>
            </div>
            <button
              onClick={() => setViewYear(viewYear + 1)}
              className="clay-card-inset !p-2 text-slate-400 hover:text-[#2c8160]"
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
                className={`py-3 rounded-3xl text-xs font-black transition-all
                  ${selectedMonth === index && selectedYear === viewYear
                    ? 'bg-[#2c8160] text-white shadow-lg shadow-[#2c8160]/30'
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {month}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-6 py-3 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;
