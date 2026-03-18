import { useState, useEffect, useMemo } from "react";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import ExpenseChart from "./components/ExpenseChart";

function App() {
  // --- 1. State สำหรับรายการ (Transactions) ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("MY_WALLET_DATA");
    return saved ? JSON.parse(saved) : [];
  });

  // --- 2. State สำหรับหมวดหมู่ (Categories) พร้อม Emoji ---
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

  // --- 3. State สำหรับการกรองรายเดือน ---
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // บันทึกข้อมูลลง LocalStorage อัตโนมัติ
  useEffect(() => {
    localStorage.setItem("MY_WALLET_DATA", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("MY_CATEGORIES", JSON.stringify(categories));
  }, [categories]);

  // --- 4. ฟังก์ชันจัดการข้อมูล ---
  const addTransaction = (item) => setTransactions([item, ...transactions]);

  const deleteTransaction = (id) =>
    setTransactions(transactions.filter((t) => t.id !== id));

  const addCategory = (type, name) => {
    // สุ่ม Emoji สนุกๆ สำหรับหมวดหมู่ที่เพิ่มใหม่
    const randomEmojis = ["✨", "🌟", "🔥", "🌈", "🎈", "💎", "🎯", "🍀"];
    const randomEmoji =
      randomEmojis[Math.floor(Math.random() * randomEmojis.length)];

    const newCat = {
      id: Date.now().toString(),
      name,
      emoji: randomEmoji,
    };

    setCategories((prev) => ({ ...prev, [type]: [...prev[type], newCat] }));
  };

  // --- 5. Logic การกรองข้อมูลตามเดือนที่เลือก ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === selectedMonth &&
        tDate.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  // คำนวณยอดเงินจากข้อมูลที่กรองแล้ว
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              My Wallet Tracker
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              จัดการเรื่องเงินให้เป็นเรื่องง่าย ✨
            </p>
          </div>

          {/* ส่วนเลือกเดือน/ปี ดีไซน์มินิมอล */}
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

        {/* ส่วนแสดงการ์ดสรุปยอดเงิน */}
        <SummaryCards
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* ฝั่งซ้าย (4/12): ฟอร์ม และ กราฟ */}
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

          {/* ฝั่งขวา (8/12): รายการประวัติ */}
          <div className="lg:col-span-8">
            <TransactionList
              transactions={filteredTransactions}
              onDelete={deleteTransaction}
              categories={categories} // ส่ง categories ไปเพื่อให้แสดง Emoji ใน List ได้
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
