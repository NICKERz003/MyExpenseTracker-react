import { useState, useRef, useEffect } from "react";
import { Trash2, Calendar, Edit2, X, Check, ChevronDown } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";

const TransactionList = ({ transactions, onDelete, onUpdate, categories }) => {
  const [editingItem, setEditingItem] = useState(null);

  // จัดกลุ่มข้อมูลตามวันที่
  const groupedTransactions = transactions.reduce((groups, transaction) => {
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
    <div className="flex flex-col h-full">
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1 scrollbar-hide pr-2">
        {sortedDates.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="text-6xl animate-float">🍃</div>
            <p className="text-slate-400 font-bold">ยังไม่มีรายการในเดือนนี้</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="mb-8 last:mb-0">
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={14} className="text-[#2c8160]" />
                  {formatDateThai(date)}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase">
                  {groupedTransactions[date].length} รายการ
                </span>
              </div>

              <div className="space-y-3">
                {groupedTransactions[date].map((item) => (
                  <div
                    key={item.id}
                    className="clay-card-inset !p-4 flex items-center justify-between hover:bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl clay-card !p-0 shadow-sm border-2 ${
                          item.type === "income" ? "border-green-100" : "border-red-100"
                        }`}
                      >
                        {getEmoji(item.categoryId, item.type)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{item.title}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {item.categoryId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p
                        className={`font-black text-lg ${item.type === "income" ? "text-[#2c8160]" : "text-[#FF6B6B]"}`}
                      >
                        {item.type === "income" ? "+" : "-"}
                        {item.amount.toLocaleString()}
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-slate-300 hover:text-[#2c8160] hover:bg-white rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-md clay-card bg-white p-8 animate-in zoom-in-95 duration-300 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-800">แก้ไขรายการ</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={20} /></button>
        </div>

        <div className="space-y-6">
          {/* Type Toggle */}
          <div className="clay-card-inset !p-1 flex">
            <button 
              onClick={() => setFormData({ ...formData, type: "income", categoryId: "" })}
              className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${formData.type === "income" ? 'bg-[#2c8160] text-white shadow-lg' : 'text-slate-400'}`}
            >
              รายรับ
            </button>
            <button 
              onClick={() => setFormData({ ...formData, type: "expense", categoryId: "" })}
              className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${formData.type === "expense" ? 'bg-[#FF6B6B] text-white shadow-lg' : 'text-slate-400'}`}
            >
              รายจ่าย
            </button>
          </div>

          {/* Custom Date Picker */}
          <div className="clay-card-inset !p-1">
            <CustomDatePicker 
              selectedDate={formData.date} 
              onChange={(date) => setFormData({ ...formData, date })} 
            />
          </div>

          {/* Title */}
          <div className="clay-card-inset !p-3">
             <p className="text-[10px] font-black text-slate-400 mb-1 uppercase px-1">รายการ</p>
             <input 
               type="text" 
               className="w-full bg-transparent outline-none font-bold text-slate-700" 
               value={formData.title}
               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
             />
          </div>

          <div className="flex gap-4">
             {/* Amount */}
             <div className="w-1/2 clay-card-inset !p-3">
                <p className="text-[10px] font-black text-slate-400 mb-1 uppercase px-1">จำนวนเงิน</p>
                <input 
                  type="number" 
                  min="0"
                  className="w-full bg-transparent outline-none font-black text-slate-800 text-lg" 
                  value={formData.amount}
                  onChange={(e) => e.target.value >= 0 && setFormData({ ...formData, amount: e.target.value })}
                />
             </div>

             {/* Category */}
             <div className="w-1/2 relative" ref={dropdownRef}>
                <p className="text-[10px] font-black text-slate-400 mb-1 uppercase px-1">หมวดหมู่</p>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="clay-card-inset !p-3 flex items-center justify-between cursor-pointer"
                >
                  <span className="text-sm font-bold truncate">
                    {selectedCategory ? `${selectedCategory.emoji} ${selectedCategory.name}` : "เลือก"}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 w-full min-w-[120%] mt-2 clay-card bg-white !p-2 z-50 shadow-2xl">
                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                      {currentCategories.map((cat) => (
                        <div 
                          key={cat.id}
                          onClick={() => {
                            setFormData({ ...formData, categoryId: cat.name });
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 p-3 hover:bg-slate-50 rounded-xl cursor-pointer"
                        >
                          <span className="text-lg">{cat.emoji}</span>
                          <span className="text-xs font-bold text-slate-600">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full clay-button-primary !py-4 flex items-center justify-center gap-2 mt-4"
          >
            บันทึกการแก้ไข <Check size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
