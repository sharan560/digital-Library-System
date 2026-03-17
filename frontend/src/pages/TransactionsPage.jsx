import { useEffect, useState } from "react";
import { transactionsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const TransactionsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [returnDates, setReturnDates] = useState({});

  const fetchItems = async () => {
    const { data } = await transactionsApi.list();
    setItems(data.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const returnBook = async (id) => {
    const selectedDate = returnDates[id];
    if (!selectedDate) return;
    await transactionsApi.returnBook(id, selectedDate);
    fetchItems();
  };

  return (
    <section className="space-y-4">
      <h2 className="ui-title text-3xl font-semibold">Transactions</h2>
      <div className="ui-panel overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-black/10 text-slate-300">
            <tr>
              <th className="p-3">Book</th>
              <th className="p-3">Issue Date</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Fine</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx) => (
              <tr key={tx._id} className="border-t border-white/15">
                <td className="p-3">{tx.bookId?.title || tx.bookId}</td>
                <td className="p-3">{new Date(tx.issueDate).toLocaleDateString()}</td>
                <td className="p-3">{new Date(tx.dueDate).toLocaleDateString()}</td>
                <td className="p-3 capitalize">{tx.status}</td>
                <td className="p-3">INR {tx.fine || 0}</td>
                <td className="p-3">
                  {tx.status !== "returned" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={returnDates[tx._id] || ""}
                        min={new Date(tx.issueDate).toISOString().split("T")[0]}
                        onChange={(e) =>
                          setReturnDates((prev) => ({
                            ...prev,
                            [tx._id]: e.target.value,
                          }))
                        }
                        className="ui-input"
                      />
                      <button
                        onClick={() => returnBook(tx._id)}
                        disabled={!returnDates[tx._id]}
                        className="ui-btn-primary disabled:opacity-40"
                      >
                        Return
                      </button>
                    </div>
                  )}
                  {tx.status === "returned" && user.role === "admin" && <span className="text-slate-500">Closed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionsPage;
