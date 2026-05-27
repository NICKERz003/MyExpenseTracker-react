import { useState, useRef, useEffect } from "react";
import { Plus, X, Calendar, ChevronDown, Check } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";

const TransactionForm = ({ isOpen, onClose, onAdd, categories, onAddCategory }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  const currentCategories =
    formData.type === "income" ? categories.income : categories.expense;

  const selectedCategory = currentCategories.find(c => c.name === formData.categoryId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.amount ||
      !formData.categoryId ||
      !formData.date
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    onAdd({ ...formData, amount: Number(formData.amount) });
    setFormData({ 
      title: "", 
      amount: "", 
      type: "expense",
      categoryId: "", 
      date: new Date().toISOString().split("T")[0] 
    });
    onClose();
  };

  const handleAddNewCategory = () => {
    if (newCatName.trim()) {
      onAddCategory(formData.type, newCatName.trim(), "✨");
      setNewCatName("");
      setIsAddingCat(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md glass-panel bg-slate-900/90 border border-slate-800/80 p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-400 rounded-full hover:bg-slate-800/50 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h3 className="text-xl font-black text-white mb-6">บันทึกรายการ</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type Selector (Income / Expense) */}
          <div className="glass-panel-inset !p-1 flex gap-1 bg-slate-950/60 border border-slate-800/40">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "income", categoryId: "" })}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                formData.type === "income"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              }`}
            >
              รายรับ
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "expense", categoryId: "" })}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                formData.type === "expense"
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              }`}
            >
              รายจ่าย
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Title / Description */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                รายละเอียดรายการ
              </label>
              <input
                type="text"
                placeholder="เช่น เงินเดือน, ค่าอาหารกลางวัน..."
                className="glass-input !py-3.5"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Amount & Category Wrapper */}
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
                  placeholder="0.00"
                  className="glass-input !py-3 text-lg font-black text-white"
                  value={formData.amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val >= 0) {
                      setFormData({ ...formData, amount: val });
                    }
                  }}
                  required
                />
              </div>

              {/* Category Selection Dropdown */}
              <div className="w-1/2 relative" ref={dropdownRef}>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                  หมวดหมู่
                </label>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="glass-input !py-3.5 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <span className={`text-sm font-bold truncate ${formData.categoryId ? 'text-white' : 'text-slate-500'}`}>
                    {selectedCategory ? `${selectedCategory.emoji || "💰"} ${selectedCategory.name}` : "เลือก..."}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 glass-panel bg-slate-950 border border-slate-800/80 !p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                      {currentCategories.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-500">ไม่มีหมวดหมู่</div>
                      ) : (
                        currentCategories.map((cat) => (
                          <div
                            key={cat.id}
                            onClick={() => {
                              setFormData({ ...formData, categoryId: cat.name });
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center justify-between p-2.5 hover:bg-slate-900 rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{cat.emoji || "💰"}</span>
                              <span className="text-xs font-bold text-slate-300">{cat.name}</span>
                            </div>
                            {formData.categoryId === cat.name && <Check size={14} className="text-emerald-400" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                วันที่ทำรายการ
              </label>
              <div className="flex items-center">
                <CustomDatePicker 
                  selectedDate={formData.date} 
                  onChange={(date) => setFormData({ ...formData, date })} 
                />
              </div>
            </div>

          </div>

          {/* Quick Add Category inline */}
          <div className="pt-2">
            {!isAddingCat ? (
              <button
                type="button"
                onClick={() => setIsAddingCat(true)}
                className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 hover:text-emerald-300 transition cursor-pointer"
              >
                <Plus size={14} className="bg-emerald-500/10 rounded p-0.5" />
                เพิ่มหมวดหมู่ใหม่
              </button>
            ) : (
              <div className="flex gap-2 items-center p-2 bg-slate-950/60 border border-slate-800/40 rounded-2xl animate-in zoom-in-95 duration-200">
                <input
                  type="text"
                  placeholder="ชื่อหมวดหมู่..."
                  className="flex-1 p-2 bg-slate-900 border border-slate-800 text-xs font-bold rounded-xl outline-none text-white focus:border-emerald-500/30"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black hover:bg-emerald-600 transition cursor-pointer"
                >
                  บันทึก
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAddingCat(false); setNewCatName(""); }}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary !py-4 text-sm font-black mt-4 shadow-lg"
          >
            บันทึกรายการ
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
