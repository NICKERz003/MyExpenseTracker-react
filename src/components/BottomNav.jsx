import React from "react";
import { 
  LayoutGrid, 
  Receipt, 
  Plus, 
  Tag, 
  TrendingUp 
} from "lucide-react";

const BottomNav = ({ activeTab, setActiveTab, onAddClick }) => {
  const navItems = [
    { id: "dashboard", label: "หน้าแรก", icon: LayoutGrid },
    { id: "transactions", label: "รายการ", icon: Receipt },
    { id: "placeholder", label: "", icon: null }, // Middle spacer for FAB
    { id: "categories", label: "หมวดหมู่", icon: Tag },
    { id: "analytics", label: "วิเคราะห์", icon: TrendingUp },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1220]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 pb-safe-bottom">
      <div className="flex justify-around items-center relative">
        {navItems.map((item, index) => {
          if (item.id === "placeholder") {
            return (
              <div key="fab-space" className="w-12 h-12 flex justify-center items-center">
                {/* Floating Add Button */}
                <button
                  onClick={onAddClick}
                  className="absolute -top-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 border-4 border-[#090d16] active:scale-95 transition-all cursor-pointer"
                  aria-label="Add Transaction"
                >
                  <Plus size={28} />
                </button>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-colors ${
                isActive ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon size={20} className={isActive ? "scale-110 transition-transform" : ""} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
