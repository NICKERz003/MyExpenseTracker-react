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
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(
        <button
          key={d}
          onClick={() => handleSelectDate(d)}
          className={`h-10 w-10 rounded-xl text-xs font-black transition-all flex items-center justify-center
            ${isSelected(d) 
              ? 'bg-[#2c8160] text-white shadow-lg shadow-[#2c8160]/30 scale-110' 
              : isToday(d)
                ? 'bg-[#2c8160]/10 text-[#2c8160]'
                : 'text-slate-600 hover:bg-slate-50'
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
        className="clay-card-inset !p-3 px-5 flex items-center gap-3 text-xs font-black text-slate-700 hover:bg-slate-50 transition-all"
      >
        <CalendarIcon size={16} className="text-[#2c8160]" />
        {formatDateThai(selectedDate)}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 z-[100] clay-card bg-white p-6 shadow-2xl w-[320px] animate-in zoom-in-95 fade-in duration-200">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => changeMonth(-1)} className="p-2 clay-card-inset !p-2 text-slate-400 hover:text-[#2c8160]"><ChevronLeft size={16} /></button>
            <div className="text-center">
              <p className="text-sm font-black text-slate-800">{months[viewDate.getMonth()]}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{viewDate.getFullYear() + 543}</p>
            </div>
            <button onClick={() => changeMonth(1)} className="p-2 clay-card-inset !p-2 text-slate-400 hover:text-[#2c8160]"><ChevronRight size={16} /></button>
          </div>

          {/* Days Name */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysShort.map(d => (
              <div key={d} className="h-8 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between">
            <button 
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                onChange(today);
                setViewDate(new Date());
                setIsOpen(false);
              }}
              className="text-[10px] font-black text-[#2c8160] hover:underline"
            >
              วันนี้
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-black text-slate-400 hover:text-red-500"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
