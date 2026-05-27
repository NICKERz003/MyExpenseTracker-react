import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";

const CustomDatePicker = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const containerRef = useRef(null);

  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const daysShort = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handleSelectDate = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const isSelected = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d.toISOString().split('T')[0] === selectedDate;
  };

  const isToday = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    // Empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8 sm:h-10 sm:w-10"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(
        <button
          key={d}
          onClick={() => handleSelectDate(d)}
          className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer border
            ${isSelected(d) 
              ? 'bg-emerald-500 text-white border-transparent shadow-lg shadow-emerald-500/25 scale-110' 
              : isToday(d)
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent hover:border-slate-850'
            }`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const formatDateThai = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-950/50 hover:bg-slate-900/60 border border-slate-850 rounded-2xl !p-3 px-5 flex items-center gap-3 text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-sm"
      >
        <CalendarIcon size={14} className="text-emerald-400 shrink-0" />
        {formatDateThai(selectedDate)}
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-[90] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed md:absolute z-[100] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:left-0 md:translate-x-0 md:top-auto md:bottom-full md:translate-y-0 mb-3 glass-panel bg-slate-950/95 border border-slate-800/80 p-5 shadow-2xl w-[285px] sm:w-[320px] text-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-5">
              <button 
                onClick={() => changeMonth(-1)} 
                className="bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-emerald-400 border border-slate-800/80 rounded-xl p-2 transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="text-center">
                <p className="text-sm font-black text-white">{months[viewDate.getMonth()]}</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{viewDate.getFullYear() + 543}</p>
              </div>
              <button 
                onClick={() => changeMonth(1)} 
                className="bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-emerald-400 border border-slate-800/80 rounded-xl p-2 transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Days Name */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysShort.map(d => (
                <div key={d} className="h-8 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderDays()}
            </div>

            {/* Quick Actions */}
            <div className="mt-5 pt-4 border-t border-slate-850 flex justify-between">
              <button 
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  onChange(today);
                  setViewDate(new Date());
                  setIsOpen(false);
                }}
                className="text-[10px] font-black text-emerald-400 hover:underline cursor-pointer"
              >
                วันนี้
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black text-slate-500 hover:text-rose-400 cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDatePicker;
