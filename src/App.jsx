import { useState, useEffect, useMemo } from "react";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import ExpenseChart from "./components/ExpenseChart";
import CategoryManager from "./components/CategoryManager";
import LandingPage from "./components/LandingPage";
import CustomDatePicker from "./components/CustomDatePicker";
import MonthYearPicker from "./components/MonthYearPicker";
import { useAuth } from "./context/AuthContext";
import { LogOut, Settings } from "lucide-react";

// --- 1. Import Firebase Tools ที่ต้องใช้ ---
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
  const [transactions, setTransactions] = useState([]);
  const [showCatManager, setShowCatManager] = useState(false);

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

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("MY_CATEGORIES", JSON.stringify(categories));
  }, [categories]);

  const addTransaction = async (item) => {
    try {
      await addDoc(collection(db, "transactions"), {
        ...item,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const { id: _, ...data } = updatedData;
      const transactionRef = doc(db, "transactions", id);
      await updateDoc(transactionRef, data);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const addCategory = (type, name, emoji = "✨") => {
    const newCat = { id: Date.now().toString(), name, emoji };
    setCategories((prev) => ({ ...prev, [type]: [...prev[type], newCat] }));
  };

  const editCategory = (type, id, updatedData) => {
    setCategories((prev) => ({
      ...prev,
      [type]: prev[type].map(cat => cat.id === id ? { ...cat, ...updatedData } : cat)
    }));
  };

  const deleteCategory = (type, id) => {
    setCategories((prev) => ({
      ...prev,
      [type]: prev[type].filter(cat => cat.id !== id)
    }));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === selectedMonth &&
        tDate.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  if (!user) {
    return <LandingPage onLogin={loginWithGoogle} />;
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-10 font-sans selection:bg-[#6C63FF] selection:text-white relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.photoURL}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-[24px] clay-card !p-0 border-4 border-white shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                สวัสดี, {user.displayName.split(" ")[0]} 👋
              </h1>
              <p className="text-sm font-bold text-slate-400">มาวางแผนการเงินกันเถอะ</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCatManager(true)}
              className="clay-card-inset !p-3 text-slate-400 hover:text-[#2c8160] transition-colors"
              title="Manage Categories"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={logout}
              className="clay-card-inset !p-3 text-red-400 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <SummaryCards
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
          <div className="lg:col-span-4 space-y-10">
            <TransactionForm
              onAdd={addTransaction}
              categories={categories}
              onAddCategory={addCategory}
            />
            <ExpenseChart
              transactions={filteredTransactions}
              categories={categories}
            />
          </div>

          <div className="lg:col-span-8">
            <div className="clay-card bg-white h-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h3 className="text-2xl font-black text-slate-800">รายการล่าสุด</h3>
                  <MonthYearPicker 
                    selectedMonth={selectedMonth} 
                    selectedYear={selectedYear} 
                    onChange={(m, y) => {
                      setSelectedMonth(m);
                      setSelectedYear(y);
                    }} 
                  />
              </div>
              <TransactionList
                transactions={filteredTransactions}
                onDelete={deleteTransaction}
                onUpdate={updateTransaction}
                categories={categories}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCatManager && (
        <CategoryManager 
          categories={categories}
          onAdd={addCategory}
          onEdit={editCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCatManager(false)}
        />
      )}
    </div>
  );
}

export default App;
