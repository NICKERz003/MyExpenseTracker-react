import { useState } from "react";
import { Plus, X, Calendar, ChevronDown } from "lucide-react";

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

  const currentCategories =
    formData.type === "income" ? categories.income : categories.expense;

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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-7 rounded-[2rem] shadow-sm space-y-5 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">บันทึกรายการ</h3>

        {/* มินิมอล ปฏิทิน */}
        <div className="relative group">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 group-focus-within:border-blue-400 transition-all">
            <Calendar size={14} className="text-blue-500" />
            <input
              type="date"
              className="text-xs font-semibold bg-transparent outline-none text-gray-600 cursor-pointer"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Selector ประเภท */}
      <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
        <button
          type="button"
          onClick={() =>
            setFormData({ ...formData, type: "income", categoryId: "" })
          }
          className={`flex-1 py-2.5 rounded-xl text-sm transition-all duration-300 ${
            formData.type === "income"
              ? "bg-white shadow-md text-green-600 font-bold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          รายรับ
        </button>
        <button
          type="button"
          onClick={() =>
            setFormData({ ...formData, type: "expense", categoryId: "" })
          }
          className={`flex-1 py-2.5 rounded-xl text-sm transition-all duration-300 ${
            formData.type === "expense"
              ? "bg-white shadow-md text-red-600 font-bold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          รายจ่าย
        </button>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="ทำอะไรมา? (เช่น ซื้อกาแฟ)"
          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-200 transition-all text-gray-700"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="0.00"
            className="w-1/2 p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-200 transition-all font-bold text-gray-800"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />

          <div className="w-1/2 relative">
            <select
              className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-200 transition-all appearance-none text-gray-700 cursor-pointer"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              <option value="">เลือกหมวดหมู่</option>
              {currentCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* จัดการหมวดหมู่ */}
      <div className="pt-2">
        {!isAddingCat ? (
          <button
            type="button"
            onClick={() => setIsAddingCat(true)}
            className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 hover:text-blue-600 transition ml-2"
          >
            <Plus size={14} /> เพิ่มหมวดหมู่ใหม่
          </button>
        ) : (
          <div className="flex gap-2 items-center p-2 bg-blue-50 rounded-xl animate-in zoom-in-95 duration-200">
            <input
              type="text"
              placeholder="ชื่อหมวดหมู่..."
              className="flex-1 p-2 bg-white text-sm rounded-lg outline-none"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold"
            >
              ตกลง
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingCat(false);
                setNewCatName("");
              }}
              className="text-gray-400 p-1"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all transform active:scale-[0.98] shadow-xl shadow-gray-100"
      >
        ยืนยันรายการ
      </button>
    </form>
  );
};

export default TransactionForm;
