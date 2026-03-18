import { Trash2, Calendar } from "lucide-react";

const TransactionList = ({ transactions, onDelete, categories }) => {
  // จัดกลุ่มข้อมูลตามวันที่
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  const formatDateThai = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ฟังก์ชันหา Emoji จากชื่อหมวดหมู่
  const getEmoji = (catName, type) => {
    const list = type === "income" ? categories.income : categories.expense;
    const found = list.find((c) => c.name === catName);
    return found ? found.emoji : "💰";
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">ประวัติการเงิน</h3>
        <div className="text-xs bg-blue-50 text-blue-500 px-3 py-1 rounded-full font-bold">
          {transactions.length} รายการ
        </div>
      </div>

      <div className="divide-y divide-gray-50 overflow-y-auto flex-1 scrollbar-hide">
        {sortedDates.length === 0 ? (
          <div className="p-20 text-center space-y-3">
            <div className="text-4xl">🍃</div>
            <p className="text-gray-400 text-sm">ยังไม่มีรายการในเดือนนี้</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              <div className="bg-gray-50/50 px-6 py-2.5 text-[11px] font-bold text-gray-400 flex justify-between items-center sticky top-0 backdrop-blur-md">
                <span className="flex items-center gap-2">
                  <Calendar size={12} className="text-blue-400" />
                  {formatDateThai(date)}
                </span>
                <span>{groupedTransactions[date].length} รายการ</span>
              </div>

              <div className="divide-y divide-gray-50">
                {groupedTransactions[date].map((item) => (
                  <div
                    key={item.id}
                    className="p-5 flex items-center justify-between hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {/* แสดง Emoji ตามหมวดหมู่ */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                          item.type === "income" ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        {getEmoji(item.categoryId, item.type)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.title}</p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                          {item.categoryId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p
                        className={`font-bold text-lg ${item.type === "income" ? "text-green-500" : "text-red-500"}`}
                      >
                        {item.type === "income" ? "+" : "-"}
                        {item.amount.toLocaleString()}
                      </p>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
