import { useState, useRef, useEffect } from "react";
import { Plus, X, Calendar, ChevronDown, Check } from "lucide-react";

const TransactionForm = ({ onAdd, categories, onAddCategory }) => {
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
    onAdd({ ...formData, id: Date.now(), amount: Number(formData.amount) });
    setFormData({ ...formData, title: "", amount: "", categoryId: "" });
  };

  const handleAddNewCategory = () => {
    if (newCatName.trim()) {
      onAddCategory(formData.type, newCatName.trim());
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

  return (
    <form
      onSubmit={handleSubmit}
      className="clay-card bg-white space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800">บันทึกรายการ</h3>

        {/* Date Picker */}
        <div className="clay-card-inset !p-2 px-3 flex items-center gap-2">
          <Calendar size={14} className="text-[#6C63FF]" />
          <input
            type="date"
            className="bg-transparent outline-none text-xs font-bold text-slate-600 cursor-pointer"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      {/* Type Selector */}
      <div className="clay-card-inset !p-1 flex gap-1">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: "income", categoryId: "" })}
          className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${formData.type === "income"
            ? "bg-[#2c8160] text-white shadow-lg shadow-[#2c8160]/20"
            : "text-slate-400 hover:bg-slate-100"
            }`}
        >
          รายรับ
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: "expense", categoryId: "" })}
          className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${formData.type === "expense"
            ? "bg-[#FF6B6B] text-white shadow-lg shadow-[#FF6B6B]/20"
            : "text-slate-400 hover:bg-slate-100"
            }`}
        >
          รายจ่าย
        </button>
      </div>

      <div className="space-y-4">
        <div className="clay-card-inset !p-0 overflow-hidden">
          <input
            type="text"
            placeholder="ทำอะไรมา?"
            className="w-full p-4 bg-transparent outline-none text-slate-700 font-bold placeholder:text-slate-300"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2 clay-card-inset !p-0 overflow-hidden">
            <input
              type="number"
              min="0"
              placeholder="0.00"
              className="w-full p-4 bg-transparent outline-none text-slate-800 font-black text-xl placeholder:text-slate-300"
              value={formData.amount}
              onChange={(e) => {
                const val = e.target.value;
                if (val >= 0) {
                  setFormData({ ...formData, amount: val });
                }
              }}
            />
          </div>

          {/* Custom Category Dropdown */}
          <div className="w-1/2 relative" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="clay-card-inset !p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <span className={`font-bold text-sm truncate ${formData.categoryId ? 'text-slate-800' : 'text-slate-300'}`}>
                {selectedCategory ? `${selectedCategory.emoji || "💰"} ${selectedCategory.name}` : "หมวดหมู่"}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 clay-card bg-white !p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-48 overflow-y-auto scrollbar-hide">
                  {currentCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setFormData({ ...formData, categoryId: cat.name });
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.emoji || "💰"}</span>
                        <span className="text-sm font-bold text-slate-600">{cat.name}</span>
                      </div>
                      {formData.categoryId === cat.name && <Check size={14} className="text-[#6C63FF]" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Category */}
      <div className="pt-2">
        {!isAddingCat ? (
          <button
            type="button"
            onClick={() => setIsAddingCat(true)}
            className="text-xs font-black text-[#6C63FF] flex items-center gap-2 hover:opacity-80 transition"
          >
            <Plus size={16} className="bg-[#6C63FF]/10 rounded-lg p-0.5" /> เพิ่มหมวดหมู่ใหม่
          </button>
        ) : (
          <div className="flex gap-2 items-center p-2 bg-slate-50 rounded-2xl animate-in zoom-in-95 duration-200">
            <input
              type="text"
              placeholder="ชื่อหมวดหมู่..."
              className="flex-1 p-2 bg-white text-sm font-bold rounded-xl outline-none clay-card-inset !p-2"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="bg-[#6C63FF] text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-[#6C63FF]/20"
            >
              เพิ่ม
            </button>
            <button
              type="button"
              onClick={() => { setIsAddingCat(false); setNewCatName(""); }}
              className="text-slate-400 hover:text-slate-600 "
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full clay-button-primary !py-5 text-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-[#2c8160]/30"
      >
        บันทึกรายการ
      </button>
    </form>
  );
};

export default TransactionForm;
