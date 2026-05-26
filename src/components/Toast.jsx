import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeConfig = {
    success: {
      bg: "bg-emerald-950/80 border-emerald-500/30 text-emerald-300",
      icon: <CheckCircle2 size={18} className="text-emerald-400" />,
    },
    error: {
      bg: "bg-rose-950/80 border-rose-500/30 text-rose-300",
      icon: <AlertCircle size={18} className="text-rose-400" />,
    },
    info: {
      bg: "bg-slate-900/80 border-slate-700/50 text-slate-300",
      icon: <Info size={18} className="text-slate-400" />,
    },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center gap-3 p-4 pr-6 rounded-2xl border backdrop-blur-xl shadow-2xl ${config.bg}`}>
        {config.icon}
        <span className="text-sm font-bold tracking-tight">{message}</span>
        <button 
          onClick={onClose} 
          className="ml-3 p-0.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
