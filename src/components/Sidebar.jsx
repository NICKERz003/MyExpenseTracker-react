import React from "react";
import { 
  LayoutGrid, 
  Receipt, 
  Tag, 
  TrendingUp, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Wallet
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, user, onLogout, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { id: "dashboard", label: "แดชบอร์ด", icon: LayoutGrid },
    { id: "transactions", label: "รายการทั้งหมด", icon: Receipt },
    { id: "categories", label: "หมวดหมู่", icon: Tag },
    { id: "analytics", label: "วิเคราะห์ข้อมูล", icon: TrendingUp },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-[#0c1220]/80 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 min-w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Wallet size={20} />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-black tracking-tight text-white animate-in fade-in duration-200">
              My<span className="text-emerald-500">Expense</span>
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-emerald-400 transition-colors text-slate-400 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent"
              }`}
            >
              <Icon size={20} className={isActive ? "text-emerald-400" : ""} />
              {!isCollapsed && <span className="text-sm font-semibold truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User / Logout */}
      {user && (
        <div className="p-4 border-t border-slate-800/60 space-y-3">
          {!isCollapsed && (
            <div className="flex items-center gap-3 p-2 bg-slate-950/40 rounded-2xl border border-slate-800/40">
              <img 
                src={user.photoURL} 
                alt="Profile" 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">{user.displayName}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent transition-all duration-200 cursor-pointer`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-bold">ออกจากระบบ</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
