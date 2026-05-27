import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as ChartIcon } from "lucide-react";

const ExpenseChart = ({ transactions, categories }) => {
  const [viewType, setViewType] = useState("expense");

  const getEmoji = (name) => {
    const allCats = [...categories.income, ...categories.expense];
    const found = allCats.find((c) => c.name === name);
    return found ? found.emoji : "💰";
  };

  const chartData = transactions
    .filter((t) => t.type === viewType)
    .reduce((acc, curr) => {
      const existing = acc.find((i) => i.name === curr.categoryId);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({
          name: curr.categoryId,
          value: curr.amount,
          emoji: getEmoji(curr.categoryId),
        });
      }
      return acc;
    }, []);

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    emoji,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (value / totalAmount < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {emoji}
      </text>
    );
  };

  const INCOME_COLORS = ["#10b981", "#059669", "#34d399", "#047857", "#6ee7b7", "#065f46"];
  const EXPENSE_COLORS = ["#f43f5e", "#e11d48", "#fb7185", "#be123c", "#fda4af", "#9f1239"];
  const colors = viewType === "income" ? INCOME_COLORS : EXPENSE_COLORS;

  return (
    <div className="glass-panel h-[480px] flex flex-col hover:border-slate-800/80 duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${
              viewType === "income" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}>
              <ChartIcon size={16} />
            </div>
            สัดส่วน{viewType === "income" ? "รายรับ" : "รายจ่าย"}
          </h3>
          <p className={`text-sm font-black mt-2 ${
            viewType === "income" ? "text-emerald-400" : "text-rose-400"
          }`}>
            ยอดรวม: ฿{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* View Toggle */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-1 flex">
          <button
            onClick={() => setViewType("income")}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
              viewType === "income" 
                ? "bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-md" 
                : "text-slate-500 hover:text-slate-350"
            }`}
          >
            รายรับ
          </button>
          <button
            onClick={() => setViewType("expense")}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
              viewType === "expense" 
                ? "bg-slate-800 text-rose-450 border border-slate-700/50 shadow-md" 
                : "text-slate-500 hover:text-slate-350"
            }`}
          >
            รายจ่าย
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 min-h-0 relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                animationDuration={1000}
                animationBegin={0}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="#090d16"
                    strokeWidth={2}
                    className="hover:opacity-90 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c1220",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                  padding: "10px 15px",
                }}
                itemStyle={{ fontWeight: "bold" }}
                formatter={(value, name, props) => [
                  <span className="text-white">฿{value.toLocaleString()}</span>,
                  <span className="text-slate-400">{props.payload.emoji} {name}</span>,
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={40} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ 
                  fontSize: "11px", 
                  fontWeight: "bold", 
                  paddingTop: "15px", 
                  color: "#94a3b8" 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 font-bold space-y-4">
            <div className="text-5xl animate-float">📊</div>
            <p className="text-xs">ยังไม่มีข้อมูลในส่วนนี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
