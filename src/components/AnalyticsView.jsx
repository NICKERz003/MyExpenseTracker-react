import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";
import ExpenseChart from "./ExpenseChart";

const AnalyticsView = ({ transactions, categories, selectedMonth, selectedYear }) => {
  // Aggregate daily income/expense for the selected month/year
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  const dailyData = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    // Sum for this day
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    const income = dayTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      day: `${day}`,
      income,
      expense,
    };
  });

  // Filter out days with zero income and zero expense to make the chart look denser if needed,
  // or show all days. For monthly views, showing all days as a line/bar chart is standard.
  const hasData = transactions.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Breakdown Chart */}
        <div className="glass-panel lg:col-span-8 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-emerald-400">
                <BarChart3 size={16} />
              </div>
              เปรียบเทียบ รายรับ - รายจ่าย รายวัน
            </h3>
          </div>

          <div className="flex-1 min-h-0 relative">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontWeight="bold"
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c1220",
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                      padding: "10px 15px",
                    }}
                    labelFormatter={(label) => `วันที่ ${label}`}
                    formatter={(value, name) => [
                      <span className="text-white">฿{value.toLocaleString()}</span>,
                      <span className="text-slate-400">{name === "income" ? "รายรับ" : "รายจ่าย"}</span>
                    ]}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", fontWeight: "bold", color: "#94a3b8" }}
                  />
                  <Bar dataKey="income" name="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="expense" name="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 font-bold space-y-4">
                <div className="text-5xl animate-float">📈</div>
                <p className="text-xs">ยังไม่มีข้อมูลในเดือนนี้</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="lg:col-span-4">
          <ExpenseChart transactions={transactions} categories={categories} />
        </div>

      </div>
    </div>
  );
};

export default AnalyticsView;
