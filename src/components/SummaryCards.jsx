import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const SummaryCards = ({ totalBalance, totalIncome, totalExpense }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Balance Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">ยอดเงินคงเหลือ</p>
            <h3 className="text-2xl font-bold text-gray-800">
              ฿{totalBalance.toLocaleString()}
            </h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-full text-blue-500">
            <Wallet size={24} />
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">รายรับเดือนนี้</p>
            <h3 className="text-2xl font-bold text-green-600">
              +฿{totalIncome.toLocaleString()}
            </h3>
          </div>
          <div className="bg-green-50 p-3 rounded-full text-green-500">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">รายจ่ายเดือนนี้</p>
            <h3 className="text-2xl font-bold text-red-600">
              -฿{totalExpense.toLocaleString()}
            </h3>
          </div>
          <div className="bg-red-50 p-3 rounded-full text-red-500">
            <TrendingDown size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SummaryCards;