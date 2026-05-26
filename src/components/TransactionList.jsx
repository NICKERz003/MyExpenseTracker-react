import { useState, useRef, useEffect } from "react";
import { Trash2, Calendar, Edit2, X, Check, ChevronDown, Search, Filter } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";

const TransactionList = ({ transactions, onDelete, onUpdate, categories }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all', 'today', 'week', 'month'

  // Helper: check if date is today
  const isToday = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  };

  // Helper: check if date is within this week (7 days)
  const isThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Helper: check if date is within this month
  const isThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // Filter and search logic
  const filteredTransactions = transactions.filter((t) => {
    // Search query match
    const titleMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = t.categoryId.toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatch = titleMatch || catMatch;

    if (!queryMatch) return false;

    // Time filter match
    if (filterTab === "today") return isToday(t.date);
    if (filterTab === "week") return isThisWeek(t.date);
    if (filterTab === "month") return isThisMonth(t.date);

    return true;
  });

  // Group by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  const formatDateThai = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getEmoji = (catName, type) => {
    const list = type === "income" ? categories.income : categories.expense;
    const found = list.find((c) => c.name === catName);
    return found ? found.emoji : "💰";
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="ค้นหารายการ หรือ หมวดหมู่..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-all font-semibold"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-950/40 border border-slate-800/80 rounded-2xl p-1 gap-1">
          {[
            { id: "all", label: "ทั้งหมด" },
            { id: "today", label: "วันนี้" },
            { id: "week", label: "สัปดาห์นี้" },
            { id: "month", label: "เดือนนี้" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === tab.id
                  ? "bg-slate-800 text-emerald-400 border border-slate-700/50"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Groups / Timeline */}
      <div className="divide-y divide-slate-800/40 overflow-y-auto flex-1 scrollbar-hide pr-1 min-h-[400px]">
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="text-5xl animate-float">🍃</div>
            <div className="space-y-1">
              <p className="text-slate-400 font-bold text-sm">ไม่พบรายการธุรกรรม</p>
              <p className="text-xs text-slate-600">ลองค้นหาด้วยคำอื่น หรือเพิ่มรายการบันทึกใหม่</p>
            </div>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="py-6 first:pt-0 last:pb-0">
              {/* Date Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={14} className="text-emerald-400" />
                  {formatDateThai(date)}
                </span>
                <span className="bg-slate-950/60 border border-slate-800/60 px-3 py-1 rounded-full text-[10px] font-black text-slate-500">
                  {groupedTransactions[date].length} รายการ
                </span>
              </div>

              {/* Transactions in Date */}
              <div className="space-y-3">
                {groupedTransactions[date].map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel-inset !p-4 flex items-center justify-between hover:bg-slate-900/40 hover:border-slate-800/80 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Emoji Icon Badge */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-slate-950 border shrink-0 ${
                          item.type === "income" 
                            ? "border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                            : "border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
                        }`}
                      >
                        {getEmoji(item.categoryId, item.type)}
                      </div>
                      
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 tracking-tight text-sm truncate">{item.title}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                          {item.categoryId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <p
                        className={`font-black text-base ${
                          item.type === "income" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {item.type === "income" ? "+" : "-"}
                        ฿{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      
                      {/* Actions hover */}
                      <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-slate-950/80 border border-transparent hover:border-slate-850 rounded-xl transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 text-slate-500 hover:text-rose-450 hover:bg-slate-950/80 border border-transparent hover:border-slate-850 rounded-xl transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditModal 
          item={editingItem} 
          categories={categories} 
          onSave={(data) => {
            onUpdate(editingItem.id, data);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

// EditModal Redesigned
const EditModal = ({ item, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...item });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentCategories = formData.type === "income" ? categories.income : categories.expense;
  const selectedCategory = currentCategories.find(c => c.name === formData.categoryId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    if (!formData.title || !formData.amount || !formData.categoryId) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md glass-panel bg-slate-900 border border-slate-800/80 p-8 animate-in zoom-in-95 duration-300 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-white">แก้ไขรายการ</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-full transition-all cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Type Toggle */}
          <div className="glass-panel-inset !p-1 flex bg-slate-950/60 border border-slate-800/40">
            <button 
              onClick={() => setFormData({ ...formData, type: "income", categoryId: "" })}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                formData.type === "income" 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              รายรับ
            </button>
            <button 
              onClick={() => setFormData({ ...formData, type: "expense", categoryId: "" })}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                formData.type === "expense" 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              รายจ่าย
            </button>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
              วันที่ทำรายการ
            </label>
            <CustomDatePicker 
              selectedDate={formData.date} 
              onChange={(date) => setFormData({ ...formData, date })} 
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
              รายละเอียดรายการ
            </label>
            <input 
              type="text" 
              className="glass-input !py-3" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Amount & Category */}
          <div className="flex gap-4">
             {/* Amount */}
             <div className="w-1/2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                  จำนวนเงิน (บาท)
                </label>
                <input 
                  type="number" 
                  min="0.01"
                  step="any"
                  className="glass-input !py-3 font-black text-white text-base" 
                  value={formData.amount}
                  onChange={(e) => e.target.value >= 0 && setFormData({ ...formData, amount: e.target.value })}
                />
             </div>

             {/* Category */}
             <div className="w-1/2 relative" ref={dropdownRef}>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                  หมวดหมู่
                </label>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="glass-input !py-3.5 flex items-center justify-between cursor-pointer"
                >
                  <span className="text-xs font-bold truncate text-white">
                    {selectedCategory ? `${selectedCategory.emoji} ${selectedCategory.name}` : "เลือก"}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 w-full min-w-[120%] mt-2 glass-panel bg-slate-950 border border-slate-800/80 !p-1.5 z-[210] shadow-2xl">
                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                      {currentCategories.map((cat) => (
                        <div 
                          key={cat.id}
                          onClick={() => {
                            setFormData({ ...formData, categoryId: cat.name });
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 p-2 hover:bg-slate-900 rounded-xl cursor-pointer"
                        >
                          <span className="text-base">{cat.emoji}</span>
                          <span className="text-xs font-bold text-slate-350">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full btn-primary !py-4 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            บันทึกการแก้ไข <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
