import React, { useState } from "react";
import { X, Plus, Edit2, Trash2, Check, LayoutGrid, Smile } from "lucide-react";

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
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      {/* Backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        className="animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Window */}
      <div 
        className="relative w-full max-w-lg clay-card bg-white p-8 animate-in zoom-in-95 fade-in duration-300 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-2 border-white/50 flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full clay-card !p-0 flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all z-10 shadow-lg"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#2c8160] rounded-2xl flex items-center justify-center text-white clay-button shadow-lg shadow-[#2c8160]/30">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">ตั้งค่าหมวดหมู่</h2>
            <p className="text-xs font-bold text-slate-400">จัดการอิโมจิและชื่อรายการ</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="clay-card-inset !p-1.5 flex mb-8">
          <button 
            onClick={() => { setActiveTab("expense"); setIsAdding(false); setEditingId(null); setShowPickerFor(null); }}
            className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === "expense" ? 'bg-white shadow-md text-[#FF6B6B]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            รายจ่าย
          </button>
          <button 
            onClick={() => { setActiveTab("income"); setIsAdding(false); setEditingId(null); setShowPickerFor(null); }}
            className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === "income" ? 'bg-white shadow-md text-[#2c8160]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            รายรับ
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide pb-4">
          {currentCats.map((cat) => (
            <div key={cat.id} className="relative">
              <div className="clay-card-inset !p-3 flex items-center justify-between group bg-slate-50/30">
                {editingId === cat.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <button 
                      onClick={() => setShowPickerFor(showPickerFor === cat.id ? null : cat.id)}
                      className="w-12 h-12 flex items-center justify-center bg-white rounded-xl clay-card-inset !p-0 text-xl hover:scale-105 transition-transform"
                    >
                      {editForm.emoji}
                    </button>
                    <input 
                      type="text" 
                      className="flex-1 p-2 px-4 bg-white rounded-xl clay-card-inset !p-2 outline-none font-bold text-sm" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      autoFocus
                    />
                    <button onClick={() => handleSaveEdit(cat.id)} className="bg-green-500 text-white p-2 rounded-xl shadow-lg transition-transform active:scale-90"><Check size={18} /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 clay-card bg-white !p-0 flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                        {cat.emoji}
                      </div>
                      <span className="font-black text-slate-700 tracking-tight">{cat.name}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleStartEdit(cat)}
                        className="w-9 h-9 flex items-center justify-center clay-card-inset !p-0 text-slate-400 hover:text-[#6C63FF] hover:bg-white"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(activeTab, cat.id)}
                        className="w-9 h-9 flex items-center justify-center clay-card-inset !p-0 text-slate-400 hover:text-red-500 hover:bg-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Inline Emoji Picker for Editing */}
              {showPickerFor === cat.id && (
                <div className="absolute top-full left-0 w-full mt-2 z-50 clay-card bg-white p-4 shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลือกอิโมจิ</p>
                    <button onClick={() => setShowPickerFor(null)} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {COMMON_EMOJIS.map(e => (
                      <button 
                        key={e} 
                        onClick={() => selectEmoji(e)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all text-xl hover:scale-110 active:scale-90"
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
              <div className="p-4 bg-[#2c8160]/5 rounded-3xl border-2 border-dashed border-[#2c8160]/20 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="flex gap-3">
                    <button 
                      onClick={() => setShowPickerFor(showPickerFor === 'add' ? null : 'add')}
                      className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl clay-card-inset !p-0 text-2xl hover:scale-105 transition-transform"
                    >
                      {addForm.emoji}
                    </button>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 mb-1 uppercase px-1">ชื่อหมวดหมู่</p>
                      <input 
                        type="text" 
                        placeholder="เช่น ค่าอาหาร..."
                        className="w-full p-3 px-5 bg-white rounded-2xl clay-card-inset !p-3 outline-none font-bold" 
                        value={addForm.name}
                        onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                        autoFocus
                      />
                    </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAdd}
                    className="flex-1 clay-button-primary !py-4 flex items-center justify-center gap-2"
                  >
                    บันทึกหมวดหมู่ <Check size={18} />
                  </button>
                  <button 
                    onClick={() => { setIsAdding(false); setShowPickerFor(null); }}
                    className="w-14 clay-card-inset !p-0 flex items-center justify-center text-slate-400 text-xs font-bold"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { setIsAdding(true); setEditingId(null); setShowPickerFor(null); }}
                className="w-full py-5 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-black hover:border-[#2c8160] hover:text-[#2c8160] transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Plus size={24} className="bg-[#2c8160]/10 p-1 rounded-lg" /> เพิ่มหมวดหมู่ใหม่
              </button>
            )}

            {/* Inline Emoji Picker for Adding */}
            {showPickerFor === 'add' && (
              <div className="absolute bottom-full left-0 w-full mb-2 z-50 clay-card bg-white p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">เลือกอิโมจิให้หมวดหมู่</p>
                  <button onClick={() => setShowPickerFor(null)} className="text-slate-300 hover:text-red-500"><X size={16} /></button>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {COMMON_EMOJIS.map(e => (
                    <button 
                      key={e} 
                      onClick={() => selectEmoji(e)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-2xl hover:scale-110 active:scale-90"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Click outside or use (x) to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
