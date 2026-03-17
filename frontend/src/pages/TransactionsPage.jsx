import { useEffect, useState } from "react";
import { transactionsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const TransactionsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const { data } = await transactionsApi.list();
    setItems(data.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const returnBook = async (id) => {
    await transactionsApi.returnBook(id);
    fetchItems();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold">Transactions</h2>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/70">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
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
              <tr key={tx._id} className="border-t border-white/10">
                <td className="p-3">{tx.bookId?.title || tx.bookId}</td>
                <td className="p-3">{new Date(tx.issueDate).toLocaleDateString()}</td>
                <td className="p-3">{new Date(tx.dueDate).toLocaleDateString()}</td>
                <td className="p-3 capitalize">{tx.status}</td>
                <td className="p-3">INR {tx.fine || 0}</td>
                <td className="p-3">
                  {tx.status !== "returned" && (
                    <button
                      onClick={() => returnBook(tx._id)}
                      className="rounded bg-amber-400 px-3 py-1 text-slate-900"
                    >
                      Return
                    </button>
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
