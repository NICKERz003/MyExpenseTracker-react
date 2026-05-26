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
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-white overflow-x-hidden font-sans relative">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center rounded-xl text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Wallet size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            My<span className="text-emerald-400">Expense</span>
          </span>
        </div>
        
        <button 
          onClick={onLogin}
          className="btn-primary !px-6 !py-2.5 text-sm flex items-center gap-2 group cursor-pointer"
        >
          เข้าสู่ระบบ <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-28 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          
          <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800">
            <span className="bg-emerald-500/20 p-1 rounded-full"><Sparkles size={12} className="text-emerald-400" /></span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              วางแผนการเงินอัจฉริยะในสไตล์ที่เป็นคุณ
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.15] tracking-tight">
            บันทึกความมั่งคั่ง <br /> 
            ด้วยดีไซน์ที่ <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">เรียบหรู.</span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-lg font-medium">
            ยกระดับการจัดการรายรับ-รายจ่ายของคุณ ด้วยเครื่องมือที่สร้างขึ้นมาเพื่อความง่าย สวยงาม และช่วยให้คุณควบคุมการเงินได้อย่างมืออาชีพ
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={onLogin} 
              className="btn-primary text-base px-10 py-5 hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              เริ่มต้นใช้งานฟรี <ArrowRight size={20} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-8 pt-6 border-t border-slate-800/40">
            <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>ปลอดภัยสูง 100%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs">
              <Sparkles size={18} className="text-cyan-400" />
              <span>ซิงค์ข้อมูลเรียลไทม์</span>
            </div>
          </div>
        </div>

        {/* Hero Visuals */}
        <div className="relative animate-in zoom-in duration-1000 flex justify-center">
          
          {/* Main Visual Glass Card */}
          <div className="glass-panel w-full max-w-[420px] aspect-[4/3] bg-slate-900/40 border border-white/5 relative overflow-hidden flex flex-col justify-between p-8 shadow-2xl shadow-emerald-950/10">
             
             {/* Background glow in card */}
             <div className="absolute -top-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>
             <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl"></div>
             
             {/* Card Top */}
             <div className="flex justify-between items-center relative z-10">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
               </div>
               <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                 FINANCE DASHBOARD
               </span>
             </div>
             
             {/* Card Middle (Visual Center) */}
             <div className="relative z-10 my-auto py-6 flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-2">
                  <DollarSign size={28} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ยอดเงินคงเหลือทั้งหมด</p>
                <p className="text-4xl font-black text-white tracking-tight">฿148,250.00</p>
             </div>

             {/* Card Bottom */}
             <div className="flex justify-between items-center relative z-10 border-t border-slate-800/60 pt-4">
               <div className="flex items-center gap-2 text-emerald-400">
                 <TrendingUp size={16} />
                 <span className="text-xs font-bold">+18.4% เดือนนี้</span>
               </div>
               <span className="text-[10px] text-slate-500 font-bold">อัปเดตเมื่อครู่</span>
             </div>
          </div>
          
          {/* Floating Stats Widget 1 */}
          <div className="absolute -top-6 -right-4 glass-panel bg-slate-950/70 border border-slate-800/80 p-5 min-w-[170px] animate-float shadow-xl flex items-center gap-3" style={{ animationDelay: "0s" }}>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">รายรับ</span>
              <span className="text-sm font-black text-white">฿85,000</span>
            </div>
          </div>

          {/* Floating Stats Widget 2 */}
          <div className="absolute -bottom-8 -left-4 glass-panel bg-slate-950/70 border border-slate-800/80 p-5 min-w-[170px] animate-float shadow-xl flex items-center gap-3" style={{ animationDelay: "1.8s" }}>
            <div className="bg-cyan-500/10 p-2.5 rounded-xl text-cyan-400">
              <ChartIcon size={18} />
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">เงินเก็บ</span>
              <span className="text-sm font-black text-white">฿63,250</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-slate-900/60 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 text-slate-500 text-xs font-semibold">
        <p>© 2026 MyExpense. วางแผนการเงินอัจฉริยะเพื่อความมั่นคงในวันข้างหน้า</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-emerald-400 transition-colors">นโยบายความเป็นส่วนตัว</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">ข้อตกลงการใช้งาน</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">ติดต่อเรา</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
