import { useState, useEffect, useMemo } from "react";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import ExpenseChart from "./components/ExpenseChart";
import CategoryManager from "./components/CategoryManager";
import LandingPage from "./components/LandingPage";
import MonthYearPicker from "./components/MonthYearPicker";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import AnalyticsView from "./components/AnalyticsView";
import { useAuth } from "./context/AuthContext";
import { LogOut, Plus, Wallet, Menu } from "lucide-react";

// --- Import Firebase Tools ---
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

function App() {
  const { user, loginWithGoogle, logout } = useAuth();
  
  // Navigation & Shell States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Core Data States
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("MY_CATEGORIES");
    return saved
      ? JSON.parse(saved)
      : {
          income: [
            { id: "i1", name: "ขับแกร๊บ", emoji: "🛵" },
            { id: "i2", name: "โบนัส", emoji: "🎁" },
            { id: "i3", name: "กยศ.", emoji: "🎓" },
            { id: "i4", name: "ครอบครัวให้", emoji: "🏠" },
          ],
          expense: [
            { id: "e1", name: "อาหาร", emoji: "🍱" },
            { id: "e2", name: "เดินทาง", emoji: "🚗" },
            { id: "e3", name: "ช้อปปิ้ง", emoji: "🛍️" },
            { id: "e4", name: "ค่าที่พัก", emoji: "🏘️" },
            { id: "e5", name: "ค่าอินเตอร์เน็ต", emoji: "🌐" },
            { id: "e6", name: "ผ่อนชำระ", emoji: "💳" },
            { id: "e7", name: "ซ่อมรถ", emoji: "🔧" },
            { id: "e8", name: "ค่าน้ำมัน", emoji: "⛽" },
            { id: "e9", name: "การศึกษา", emoji: "📚" },
          ],
        };
  });

  // Date filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Real-time Firestore sync
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Sync Categories with localStorage
  useEffect(() => {
    localStorage.setItem("MY_CATEGORIES", JSON.stringify(categories));
  }, [categories]);

  // Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Transaction CRUD Actions
  const addTransaction = async (item) => {
    try {
      await addDoc(collection(db, "transactions"), {
        ...item,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      showToast("บันทึกรายการสำเร็จแล้ว");
    } catch (error) {
      console.error("Error adding document: ", error);
      showToast("เกิดข้อผิดพลาดในการบันทึกรายการ", "error");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
      showToast("ลบรายการธุรกรรมเรียบร้อยแล้ว", "info");
    } catch (error) {
      console.error("Error deleting document: ", error);
      showToast("เกิดข้อผิดพลาดในการลบรายการ", "error");
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const { id: _, ...data } = updatedData;
      const transactionRef = doc(db, "transactions", id);
      await updateDoc(transactionRef, data);
      showToast("อัปเดตรายการเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error updating document: ", error);
      showToast("เกิดข้อผิดพลาดในการอัปเดตรายการ", "error");
    }
  };

  // Category Actions
  const addCategory = (type, name, emoji = "✨") => {
    const newCat = { id: Date.now().toString(), name, emoji };
    setCategories((prev) => ({ ...prev, [type]: [...prev[type], newCat] }));
    showToast(`เพิ่มหมวดหมู่ "${name}" สำเร็จ`);
  };

  const editCategory = (type, id, updatedData) => {
    setCategories((prev) => ({
      ...prev,
      [type]: prev[type].map(cat => cat.id === id ? { ...cat, ...updatedData } : cat)
    }));
    showToast("แก้ไขรายละเอียดหมวดหมู่เรียบร้อย");
  };

  const deleteCategory = (type, id) => {
    setCategories((prev) => ({
      ...prev,
      [type]: prev[type].filter(cat => cat.id !== id)
    }));
    showToast("ลบหมวดหมู่เรียบร้อยแล้ว", "info");
  };

  // Calculations for filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === selectedMonth &&
        tDate.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);
  }, [filteredTransactions]);

  const totalBalance = totalIncome - totalExpense;

  // Recent transactions for the dashboard view
  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [filteredTransactions]);

  if (!user) {
    return <LandingPage onLogin={loginWithGoogle} />;
  }

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100">
      
      {/* Sidebar Desktop navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={logout} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center justify-between z-20">
          
          {/* User Welcome */}
          <div className="flex items-center gap-3">
            <img 
              src={user.photoURL} 
              alt="Profile" 
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl md:hidden object-cover border border-slate-800"
            />
            <div>
              <h1 className="text-sm md:text-base font-black text-white leading-tight">
                สวัสดี, {user.displayName.split(" ")[0]} 👋
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold mt-0.5">วางแผนการเงินในวันนี้เพื่ออนาคตของคุณ</p>
            </div>
          </div>

          {/* Quick Actions (Month Selector, Add Button, Log out mobile) */}
          <div className="flex items-center gap-3">
            {/* Month Year Selector */}
            {(activeTab === "dashboard" || activeTab === "transactions" || activeTab === "analytics") && (
              <MonthYearPicker 
                selectedMonth={selectedMonth} 
                selectedYear={selectedYear} 
                onChange={(m, y) => {
                  setSelectedMonth(m);
                  setSelectedYear(y);
                }} 
              />
            )}

            {/* Desktop Add Transaction Button */}
            <button 
              onClick={() => setIsTransactionModalOpen(true)}
              className="hidden md:flex btn-primary !py-2.5 !px-5 text-sm"
            >
              <Plus size={16} /> บันทึกรายการ
            </button>
            
            {/* Mobile Log out button */}
            <button 
              onClick={logout}
              className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/40 text-slate-500 hover:text-rose-455 md:hidden cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
          
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Financial Stats Summary */}
              <SummaryCards
                totalBalance={totalBalance}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
              />

              {/* Main Charts & List Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Distribution Chart */}
                <div className="lg:col-span-4">
                  <ExpenseChart
                    transactions={filteredTransactions}
                    categories={categories}
                  />
                </div>

                {/* Right Side: Recent Transactions */}
                <div className="lg:col-span-8 glass-panel flex flex-col h-[480px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-black text-white">รายการธุรกรรมล่าสุด</h3>
                    <button 
                      onClick={() => setActiveTab("transactions")}
                      className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      ดูทั้งหมด
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <TransactionList
                      transactions={recentTransactions}
                      onDelete={deleteTransaction}
                      onUpdate={updateTransaction}
                      categories={categories}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* All Transactions Tab */}
          {activeTab === "transactions" && (
            <div className="glass-panel min-h-[500px] animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6 border-b border-slate-800/40 pb-4">
                <h3 className="text-base font-black text-white">รายการธุรกรรมทั้งหมด</h3>
              </div>
              <TransactionList
                transactions={filteredTransactions}
                onDelete={deleteTransaction}
                onUpdate={updateTransaction}
                categories={categories}
              />
            </div>
          )}

          {/* Analytics View Tab */}
          {activeTab === "analytics" && (
            <AnalyticsView
              transactions={filteredTransactions}
              categories={categories}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}

        </main>
      </div>

      {/* Categories Modal Manager */}
      {activeTab === "categories" && (
        <CategoryManager 
          categories={categories}
          onAdd={addCategory}
          onEdit={editCategory}
          onDelete={deleteCategory}
          onClose={() => setActiveTab("dashboard")}
        />
      )}

      {/* Floating Add Transaction Modal */}
      <TransactionForm
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onAdd={addTransaction}
        categories={categories}
        onAddCategory={addCategory}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddClick={() => setIsTransactionModalOpen(true)}
      />

      {/* Global Toast Alert Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

export default App;
