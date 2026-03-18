import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Text,
} from "recharts";
import { PieChart as ChartIcon } from "lucide-react";

const ExpenseChart = ({ transactions, categories }) => {
  const [viewType, setViewType] = useState("expense");

  // 1. ดึง Emoji ตามชื่อหมวดหมู่
  const getEmoji = (name) => {
    const allCats = [...categories.income, ...categories.expense];
    const found = allCats.find((c) => c.name === name);
    return found ? found.emoji : "💰";
  };

  // 2. เตรียมข้อมูลสำหรับ Chart
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
          emoji: getEmoji(curr.categoryId), // ดึง Emoji มาเก็บไว้ใน Data ก้อนนี้เลย
        });
      }
      return acc;
    }, []);

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  // 3. Custom Label สำหรับแสดง Emoji บนแผ่นกราฟ
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

    // แสดงเฉพาะถ้าพื้นที่ก้อนนั้นใหญ่พอ (เช่น มากกว่า 5% ของทั้งหมด)
    if (value / totalAmount < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
      >
        {emoji}
      </text>
    );
  };

  const INCOME_COLORS = ["#10b981", "#3b82f6", "#06b6d4", "#14b8a6", "#8b5cf6"];
  const EXPENSE_COLORS = [
    "#ef4444",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
    "#6366f1",
  ];
  const colors = viewType === "income" ? INCOME_COLORS : EXPENSE_COLORS;

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-[500px] flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-1">
            <ChartIcon size={20} className="text-blue-500" />
            สัดส่วน{viewType === "income" ? "รายรับ" : "รายจ่าย"}
          </h3>
          <p
            className={`text-xs font-bold ${viewType === "income" ? "text-green-500" : "text-red-500"}`}
          >
            รวม: ฿{totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setViewType("income")}
            className={`px-3 py-1.5 rounded-lg transition ${viewType === "income" ? "bg-white shadow text-green-600" : "text-gray-400"}`}
          >
            รายรับ
          </button>
          <button
            onClick={() => setViewType("expense")}
            className={`px-3 py-1.5 rounded-lg transition ${viewType === "expense" ? "bg-white shadow text-red-600" : "text-gray-400"}`}
          >
            รายจ่าย
          </button>
        </div>
      </div>

      <div className="flex-1">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel} // เรียกใช้ฟังก์ชันแสดง Emoji
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                }}
                // ปรับ Tooltip ให้แสดง Emoji คู่กับชื่อหมวดหมู่
                formatter={(value, name, props) => [
                  <span className="font-bold text-slate-800">
                    ฿{value.toLocaleString()}
                  </span>,
                  <span className="text-slate-500">
                    {props.payload.emoji} {name}
                  </span>,
                ]}
              />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-sm">
            ไม่มีข้อมูลเดือนนี้ 🍃
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
