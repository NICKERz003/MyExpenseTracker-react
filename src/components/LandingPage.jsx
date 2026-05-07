import React from "react";
import { 
  Wallet, 
  TrendingUp, 
  PieChart as ChartIcon, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  DollarSign
} from "lucide-react";

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#F0F4F8] selection:bg-[#2c8160] selection:text-white overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2c8160] clay-button-primary flex items-center justify-center rounded-2xl shadow-lg shadow-[#2c8160]/20 hover:scale-110 transition-transform cursor-pointer">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800">My<span className="text-[#2c8160]">Expense</span></span>
        </div>
        
        <button 
          onClick={onLogin}
          className="clay-button-primary !px-8 !py-3 flex items-center gap-2 group"
        >
          Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-white/50">
            <span className="bg-[#2c8160]/10 p-1 rounded-full"><Sparkles size={14} className="text-[#2c8160]" /></span>
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">จัดการเงินของคุณให้ง่ายกว่าเดิม</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-slate-800 leading-tight">
            บันทึกความมั่งคั่ง <br /> 
            ในสไตล์ที่ <span className="text-[#2c8160]">ใช่คุณ.</span>
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg font-bold">
            ยกระดับการจัดการรายรับ-รายจ่ายของคุณ ด้วยแอปพลิเคชันที่ออกแบบมาเพื่อความเรียบง่าย สวยงาม และทรงพลัง
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onLogin} 
              className="clay-button-primary flex items-center gap-3 text-lg px-12 py-6 hover:scale-[1.05] active:scale-95 transition-all duration-300"
            >
              เริ่มต้นใช้งานฟรี <ArrowRight size={22} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-8 pt-8">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
              <ShieldCheck size={20} className="text-[#2c8160]" />
              <span>ปลอดภัย 100%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
              <Sparkles size={20} className="text-yellow-400" />
              <span>Real-time Sync</span>
            </div>
          </div>
        </div>

        {/* Hero Visuals */}
        <div className="relative animate-in zoom-in duration-1000">
          <div className="clay-card aspect-square bg-gradient-to-br from-[#2c8160] to-[#4ade80] relative overflow-hidden animate-float flex items-center justify-center">
             <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
             
             {/* Abstract Financial Shapes */}
             <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full clay-button shadow-white/10 animate-pulse flex items-center justify-center">
                <TrendingUp size={48} className="text-white" />
             </div>
             
             <div className="absolute bottom-10 left-10 w-28 h-28 bg-white/30 rounded-[40px] clay-button shadow-white/10 flex items-center justify-center">
                <ChartIcon size={40} className="text-white" />
             </div>

             <div className="relative z-10 scale-150">
                <div className="clay-card bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4">
                  <div className="bg-[#2c8160]/10 p-4 rounded-3xl">
                    <DollarSign size={40} className="text-[#2c8160]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ยอดเงินคงเหลือ</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">฿50,000</p>
                  </div>
                </div>
             </div>
          </div>
          
          {/* Floating Stats Card */}
          <div className="absolute -bottom-8 -right-8 clay-card bg-white p-6 max-w-[220px] animate-float shadow-2xl border-2 border-white" style={{ animationDelay: "1.5s" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-xl"><TrendingUp className="text-[#2c8160]" size={20} /></div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Growth</span>
            </div>
            <p className="text-lg font-black text-slate-800">+25% เดือนนี้</p>
          </div>
        </div>
      </section>

      {/* Footer / Features Minimal */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-slate-400 font-bold text-sm">© 2026 MyExpense. วางแผนการเงินเพื่ออนาคตของคุณ.</p>
        <div className="flex gap-8 text-slate-400 font-bold text-sm">
          <a href="#" className="hover:text-[#2c8160] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#2c8160] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#2c8160] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
