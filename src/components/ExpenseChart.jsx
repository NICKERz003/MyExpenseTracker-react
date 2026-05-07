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
        fontSize="16"
        fontWeight="bold"
      >
        {emoji}
      </text>
    );
  };

  const INCOME_COLORS = ["#2c8160", "#3aa37a", "#48c594", "#56e7ae", "#64ffc8"];
  const EXPENSE_COLORS = ["#FF6B6B", "#FF8E8E", "#FF4F4F", "#E63946", "#D62828"];
  const colors = viewType === "income" ? INCOME_COLORS : EXPENSE_COLORS;

  return (
    <div className="clay-card bg-white h-[500px] flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className={`p-2 rounded-xl clay-card-inset !p-2 ${viewType === "income" ? "text-[#2c8160]" : "text-[#FF6B6B]"}`}>
              <ChartIcon size={20} />
            </div>
            สัดส่วน{viewType === "income" ? "รายรับ" : "รายจ่าย"}
          </h3>
          <p className={`text-sm font-black mt-2 ${viewType === "income" ? "text-[#2c8160]" : "text-[#FF6B6B]"}`}>
            ยอดรวม: ฿{totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="clay-card-inset !p-1 flex">
          <button
            onClick={() => setViewType("income")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${viewType === "income" ? "bg-white shadow-md text-[#2c8160]" : "text-slate-400"}`}
          >
            รายรับ
          </button>
          <button
            onClick={() => setViewType("expense")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${viewType === "expense" ? "bg-white shadow-md text-[#FF6B6B]" : "text-slate-400"}`}
          >
            รายจ่าย
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                animationDuration={1500}
                animationBegin={0}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="none"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "25px",
                  border: "none",
                  boxShadow: "20px 20px 60px #d1d9e6",
                  padding: "15px 20px",
                }}
                itemStyle={{ fontWeight: "bold" }}
                formatter={(value, name, props) => [
                  <span className="text-slate-800">฿{value.toLocaleString()}</span>,
                  <span className="text-slate-400">{props.payload.emoji} {name}</span>,
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontWeight: "bold", paddingTop: "20px", color: "#64748b" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 font-bold italic space-y-4">
            <div className="text-6xl animate-float">📊</div>
            <p>ยังไม่มีข้อมูลในส่วนนี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
