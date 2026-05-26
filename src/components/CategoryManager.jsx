import React, { useState } from "react";
import { X, Plus, Edit2, Trash2, Check, LayoutGrid } from "lucide-react";

const COMMON_EMOJIS = [
  "💰", "🍱", "🚗", "🛍️", "🏠", "🌐", "💳", "🔧", "⛽", "📚", 
  "🎁", "🛵", "🎓", "🎮", "🎵", "🏥", "🍕", "☕", "🍿", "🏀",
  "📱", "💻", "🧴", "🧼", "🐶", "🐱", "🌈", "🔥", "✨", "❤️"
];

const CategoryManager = ({ categories, onAdd, onEdit, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState("expense");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", emoji: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", emoji: "✨" });
  
  // Emoji Picker States
  const [showPickerFor, setShowPickerFor] = useState(null); // 'add' or category ID

  const currentCats = categories[activeTab];

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, emoji: cat.emoji });
    setShowPickerFor(null);
  };

  const handleSaveEdit = (id) => {
    if (!editForm.name.trim()) return;
    onEdit(activeTab, id, editForm);
    setEditingId(null);
    setShowPickerFor(null);
  };

  const handleAdd = () => {
    if (addForm.name.trim()) {
      onAdd(activeTab, addForm.name.trim(), addForm.emoji);
      setAddForm({ name: "", emoji: "✨" });
      setIsAdding(false);
      setShowPickerFor(null);
    }
  };

  const selectEmoji = (emoji) => {
    if (showPickerFor === 'add') {
      setAddForm({ ...addForm, emoji });
    } else {
      setEditForm({ ...editForm, emoji });
    }
    setShowPickerFor(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-lg glass-panel bg-slate-900 border border-slate-800/80 p-8 animate-in zoom-in-95 duration-300 shadow-2xl flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-400 rounded-full hover:bg-slate-850 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <LayoutGrid size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">ตั้งค่าหมวดหมู่</h2>
            <p className="text-xs font-bold text-slate-500">จัดการชื่อและไอคอนหมวดหมู่ธุรกรรมของคุณ</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="glass-panel-inset !p-1 flex bg-slate-950/60 border border-slate-800/40 mb-6">
          <button 
            onClick={() => { setActiveTab("expense"); setIsAdding(false); setEditingId(null); setShowPickerFor(null); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "expense" 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            รายจ่าย
          </button>
          <button 
            onClick={() => { setActiveTab("income"); setIsAdding(false); setEditingId(null); setShowPickerFor(null); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "income" 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            รายรับ
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide pb-4">
          {currentCats.map((cat) => (
            <div key={cat.id} className="relative">
              <div className="glass-panel-inset !p-3 flex items-center justify-between group bg-slate-950/40 border border-slate-850">
                {editingId === cat.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <button 
                      onClick={() => setShowPickerFor(showPickerFor === cat.id ? null : cat.id)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-850 rounded-xl text-xl hover:scale-105 transition-transform"
                    >
                      {editForm.emoji}
                    </button>
                    <input 
                      type="text" 
                      className="flex-1 p-2 px-3 bg-slate-900 border border-slate-800 rounded-xl outline-none font-bold text-xs text-white" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      autoFocus
                    />
                    <button 
                      onClick={() => handleSaveEdit(cat.id)} 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-transform active:scale-90 cursor-pointer"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-center text-xl shadow-sm">
                        {cat.emoji}
                      </div>
                      <span className="font-bold text-slate-200 text-sm tracking-tight">{cat.name}</span>
                    </div>
                    
                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleStartEdit(cat)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-900 border border-slate-850 text-slate-400 hover:text-emerald-400 rounded-lg hover:border-slate-700 transition cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button 
                        onClick={() => onDelete(activeTab, cat.id)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-900 border border-slate-850 text-slate-400 hover:text-rose-455 rounded-lg hover:border-slate-700 transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Inline Emoji Picker for Editing */}
              {showPickerFor === cat.id && (
                <div className="absolute top-full left-0 w-full mt-2 z-50 glass-panel bg-slate-950 p-4 border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">เลือกไอคอนอิโมจิ</p>
                    <button onClick={() => setShowPickerFor(null)} className="text-slate-400 hover:text-white"><X size={14} /></button>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {COMMON_EMOJIS.map(e => (
                      <button 
                        key={e} 
                        onClick={() => selectEmoji(e)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-slate-900 rounded-lg text-lg hover:scale-110 active:scale-90 transition-all cursor-pointer"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Section */}
          <div className="relative mt-4">
            {isAdding ? (
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="flex gap-3">
                    <button 
                      onClick={() => setShowPickerFor(showPickerFor === 'add' ? null : 'add')}
                      className="w-12 h-12 flex items-center justify-center bg-slate-900 border border-slate-850 rounded-xl text-xl hover:scale-105 transition-transform"
                    >
                      {addForm.emoji}
                    </button>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-500 mb-1 px-1 uppercase tracking-widest">ชื่อหมวดหมู่</label>
                      <input 
                        type="text" 
                        placeholder="เช่น ค่าอาหาร, สังสรรค์..."
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none font-bold text-sm text-white" 
                        value={addForm.name}
                        onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                        autoFocus
                      />
                    </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleAdd}
                    className="flex-1 btn-primary !py-2.5 text-xs flex items-center justify-center gap-1.5"
                  >
                    บันทึก <Check size={14} />
                  </button>
                  <button 
                    onClick={() => { setIsAdding(false); setShowPickerFor(null); }}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { setIsAdding(true); setEditingId(null); setShowPickerFor(null); }}
                className="w-full py-4 bg-slate-950/30 border border-dashed border-slate-850 hover:border-emerald-500/30 hover:bg-slate-950/60 text-slate-400 hover:text-emerald-400 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Plus size={16} /> เพิ่มหมวดหมู่ใหม่
              </button>
            )}

            {/* Inline Emoji Picker for Adding */}
            {showPickerFor === 'add' && (
              <div className="absolute bottom-full left-0 w-full mb-2 z-50 glass-panel bg-slate-950 p-4 border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">เลือกไอคอนอิโมจิ</p>
                  <button onClick={() => setShowPickerFor(null)} className="text-slate-400 hover:text-white"><X size={14} /></button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {COMMON_EMOJIS.map(e => (
                    <button 
                      key={e} 
                      onClick={() => selectEmoji(e)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-slate-900 rounded-lg text-lg hover:scale-110 active:scale-90 transition-all cursor-pointer"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoryManager;
