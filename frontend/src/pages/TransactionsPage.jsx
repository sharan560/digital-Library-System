import { useEffect, useState } from "react";
import { transactionsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const DAILY_FINE = 10;

const TransactionsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [returnDates, setReturnDates] = useState({});
  const [message, setMessage] = useState("");

  const toDateInputValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchItems = async () => {
    const { data } = await transactionsApi.list();
    setItems(data.data);

    const today = toDateInputValue(new Date());
    setReturnDates((prev) => {
      const next = { ...prev };
      data.data.forEach((tx) => {
        if (tx.status === "returned") return;
        if (next[tx._id]) return;

        const issueDateValue = toDateInputValue(new Date(tx.issueDate));
        next[tx._id] = issueDateValue > today ? issueDateValue : today;
      });
      return next;
    });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const returnBook = async (id) => {
    const selectedDate = returnDates[id];
    if (!selectedDate) return;
    try {
      await transactionsApi.returnBook(id, selectedDate);
      setReturnDates((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setMessage("Book returned successfully.");
      fetchItems();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not return book.");
    }
  };

  const sendReturnEmail = async (id) => {
    const selectedDate = returnDates[id];
    if (!selectedDate) return;

    try {
      await transactionsApi.sendReturnEmail(id, selectedDate);
      setMessage("Return email sent successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not send return email.");
    }
  };

  const canReturn = (tx) => {
    return tx.status !== "returned" && user?.role === "admin";
  };

  const calculateFinePreview = (tx, selectedDate) => {
    if (!selectedDate) return tx.fine || 0;

    const dueDate = new Date(tx.dueDate);
    const referenceDate = new Date(selectedDate);

    if (referenceDate <= dueDate) return 0;

    const lateDays = Math.floor((referenceDate - dueDate) / (1000 * 60 * 60 * 24));
    return Math.max(0, lateDays * DAILY_FINE);
  };

  const filteredItems = items.filter((tx) => {
    const name = tx.userId?.name || "";
    const email = tx.userId?.email || "";
    const query = studentQuery.trim().toLowerCase();

    if (!query) return true;
    return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
  }).sort((a, b) => {
    const priority = (status) => {
      if (status === "overdue") return 0;
      if (status === "issued") return 1;
      return 2;
    };

    const pDiff = priority(a.status) - priority(b.status);
    if (pDiff !== 0) return pDiff;

    return new Date(b.issueDate) - new Date(a.issueDate);
  });

  return (
    <section className="space-y-4">
      <h2 className="ui-title text-2xl font-semibold sm:text-3xl">Transactions</h2>
      {message && (
        <div className="ui-panel p-3 text-sm text-emerald-300">
          {message}
        </div>
      )}
      <div className="ui-panel p-3">
        <input
          type="text"
          placeholder="Search student by name or email"
          value={studentQuery}
          onChange={(e) => setStudentQuery(e.target.value)}
          className="ui-input w-full"
        />
      </div>
      <div className="space-y-3 md:hidden">
        {filteredItems.map((tx) => (
          <article key={tx._id} className="ui-panel space-y-2 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="ui-title text-sm font-semibold">{tx.bookId?.title || tx.bookId}</p>
                <p className="text-xs text-slate-300">{tx.userId?.name || tx.userId?.email || "Unknown"}</p>
                {tx.userId?.email && <p className="text-[11px] text-slate-500">{tx.userId.email}</p>}
              </div>
              <span className="rounded-full border border-white/15 px-2 py-1 text-[11px] capitalize text-cyan-300">{tx.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-400">Issue</p>
                <p>{new Date(tx.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Due</p>
                <p>{new Date(tx.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400">Fine</p>
                <p className="text-sm text-lime-300">INR {calculateFinePreview(tx, returnDates[tx._id])}</p>
              </div>
            </div>

            {tx.status !== "returned" ? (
              <div className="space-y-2">
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
                  className="ui-input w-full"
                />

                {canReturn(tx) ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => sendReturnEmail(tx._id)}
                      disabled={!returnDates[tx._id]}
                      className="ui-btn-secondary text-xs disabled:opacity-40"
                    >
                      Send Email
                    </button>
                    <button
                      onClick={() => returnBook(tx._id)}
                      disabled={!returnDates[tx._id]}
                      className="ui-btn-primary text-xs disabled:opacity-40"
                    >
                      Return
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Admin only</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Closed</p>
            )}
          </article>
        ))}

        {filteredItems.length === 0 && (
          <div className="ui-panel p-4 text-center text-sm text-slate-400">
            No students matched your search.
          </div>
        )}
      </div>

      <div className="hidden md:block ui-panel overflow-x-auto">
        <table className="min-w-[680px] w-full text-left text-xs sm:min-w-[760px] sm:text-sm">
          <thead className="bg-black/10 text-slate-300">
            <tr>
              <th className="p-2 sm:p-3">Member</th>
              <th className="p-2 sm:p-3">Book</th>
              <th className="p-2 sm:p-3">Issue Date</th>
              <th className="p-2 sm:p-3">Due Date</th>
              <th className="p-2 sm:p-3">Status</th>
              <th className="p-2 sm:p-3">Fine</th>
              <th className="p-2 sm:p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((tx) => (
              <tr key={tx._id} className="border-t border-white/15">
                <td className="p-2 sm:p-3">
                  <div className="text-sm text-slate-300">{tx.userId?.name || tx.userId?.email || "Unknown"}</div>
                  {tx.userId?.email && (
                    <div className="text-xs text-slate-500">{tx.userId.email}</div>
                  )}
                </td>
                <td className="p-2 sm:p-3">{tx.bookId?.title || tx.bookId}</td>
                <td className="p-2 sm:p-3">{new Date(tx.issueDate).toLocaleDateString()}</td>
                <td className="p-2 sm:p-3">{new Date(tx.dueDate).toLocaleDateString()}</td>
                <td className="p-2 sm:p-3 capitalize">{tx.status}</td>
                <td className="p-2 sm:p-3">
                  INR {calculateFinePreview(tx, returnDates[tx._id])}
                </td>
                <td className="p-2 sm:p-3">
                  {tx.status !== "returned" ? (
                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
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
                        className="ui-input w-full sm:w-auto"
                      />
                      {canReturn(tx) ? (
                        <>
                          <button
                            onClick={() => sendReturnEmail(tx._id)}
                            disabled={!returnDates[tx._id]}
                            className="ui-btn-secondary text-xs disabled:opacity-40 sm:text-sm"
                          >
                            Send Email
                          </button>
                          <button
                            onClick={() => returnBook(tx._id)}
                            disabled={!returnDates[tx._id]}
                            className="ui-btn-primary text-xs disabled:opacity-40 sm:text-sm"
                          >
                            Return
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500">Admin only</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500">Closed</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-400">
                  No students matched your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionsPage;
