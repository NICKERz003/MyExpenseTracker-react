import { useState, useEffect, useMemo } from "react";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import ExpenseChart from "./components/ExpenseChart";
import { useAuth } from "./context/AuthContext";

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
} from "firebase/firestore";

function App() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);

  // หมวดหมู่ยังคงไว้ที่ LocalStorage หรือจะย้ายไป DB ในอนาคตก็ได้ครับ
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

  // --- 2. ดึงข้อมูลจาก Firestore แบบ Real-time ---
  useEffect(() => {
    if (!user) return;

    // กรองเฉพาะข้อมูลของ user ที่ login อยู่
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("MY_CATEGORIES", JSON.stringify(categories));
  }, [categories]);

  // --- 3. ฟังก์ชันจัดการข้อมูลบน Firestore ---
  const addTransaction = async (item) => {
    try {
      await addDoc(collection(db, "transactions"), {
        ...item,
        userId: user.uid, // ผูกข้อมูลกับ UID ของผู้ใช้
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

  const addCategory = (type, name) => {
    const randomEmojis = ["✨", "🌟", "🔥", "🌈", "🎈", "💎", "🎯", "🍀"];
    const randomEmoji =
      randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
    const newCat = { id: Date.now().toString(), name, emoji: randomEmoji };
    setCategories((prev) => ({ ...prev, [type]: [...prev[type], newCat] }));
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
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="text-6xl mb-6">💰</div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">My Wallet</h1>
          <p className="text-slate-400 mb-8 font-medium">
            จดบันทึกรายรับ-รายจ่ายของคุณให้เป็นระเบียบและปลอดภัย
          </p>
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.png"
              width="20"
              alt="google"
            />
            เข้าสู่ระบบด้วย Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.photoURL}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl border-4 border-white shadow-sm"
            />
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                สวัสดี, {user.displayName} 👋
              </h1>
              <button
                onClick={logout}
                className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <select
              className="bg-transparent outline-none text-slate-600 font-bold px-3 py-1 cursor-pointer text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {[
                "มกราคม",
                "กุมภาพันธ์",
                "มีนาคม",
                "เมษายน",
                "พฤษภาคม",
                "มิถุนายน",
                "กรกฎาคม",
                "สิงหาคม",
                "กันยายน",
                "ตุลาคม",
                "พฤศจิกายน",
                "ธันวาคม",
              ].map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <div className="w-[1px] bg-slate-100 my-1"></div>
            <select
              className="bg-transparent outline-none text-slate-600 font-bold px-3 py-1 cursor-pointer text-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </header>

        <SummaryCards
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          <div className="lg:col-span-4 space-y-8">
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
            <TransactionList
              transactions={filteredTransactions}
              onDelete={deleteTransaction}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
