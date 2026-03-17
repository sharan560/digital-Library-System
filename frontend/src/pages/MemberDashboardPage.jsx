import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import { reservationsApi, transactionsApi } from "../services/api";

const MemberDashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    transactionsApi.list().then((res) => setTransactions(res.data.data));
    reservationsApi.list().then((res) => setReservations(res.data.data));
  }, []);

  const stats = useMemo(() => {
    const active = transactions.filter((t) => t.status !== "returned").length;
    const fines = transactions.reduce((sum, t) => sum + (t.fine || 0), 0);
    const overdue = transactions.filter((t) => t.status === "overdue").length;
    return { active, fines, overdue };
  }, [transactions]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Member Zone</p>
        <h2 className="ui-title text-3xl font-semibold">My Library Snapshot</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Active Borrows" value={stats.active} />
        <StatCard title="Overdue" value={stats.overdue} />
        <StatCard title="Total Fine" value={`INR ${stats.fines}`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ui-panel p-4">
          <p className="ui-title mb-3 text-lg">Issued Books</p>
          <div className="space-y-2">
            {transactions.slice(0, 6).map((tx) => (
              <div key={tx._id} className="rounded-lg border border-white/15 p-3 text-sm">
                <p className="ui-title">{tx.bookId?.title || "Book"}</p>
                <p className="ui-muted">Due: {new Date(tx.dueDate).toLocaleDateString()}</p>
                <p className="text-cyan-300">Status: {tx.status}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ui-panel p-4">
          <p className="ui-title mb-3 text-lg">Reservations</p>
          <div className="space-y-2">
            {reservations.slice(0, 6).map((r) => (
              <div key={r._id} className="rounded-lg border border-white/15 p-3 text-sm">
                <p className="ui-title">{r.bookId?.title || "Book"}</p>
                <p className="ui-muted">Queue: {r.queuePosition}</p>
                <p className="text-fuchsia-300">{r.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberDashboardPage;
