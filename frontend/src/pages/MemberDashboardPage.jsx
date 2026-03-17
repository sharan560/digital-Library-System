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
        <p className="text-sm uppercase tracking-[0.2em] text-amber-400">Member Zone</p>
        <h2 className="text-3xl font-semibold">My Library Snapshot</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Active Borrows" value={stats.active} />
        <StatCard title="Overdue" value={stats.overdue} />
        <StatCard title="Total Fine" value={`INR ${stats.fines}`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="mb-3 text-lg">Issued Books</p>
          <div className="space-y-2">
            {transactions.slice(0, 6).map((tx) => (
              <div key={tx._id} className="rounded-lg border border-white/10 p-3 text-sm">
                <p className="text-slate-100">{tx.bookId?.title || "Book"}</p>
                <p className="text-slate-400">Due: {new Date(tx.dueDate).toLocaleDateString()}</p>
                <p className="text-amber-300">Status: {tx.status}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="mb-3 text-lg">Reservations</p>
          <div className="space-y-2">
            {reservations.slice(0, 6).map((r) => (
              <div key={r._id} className="rounded-lg border border-white/10 p-3 text-sm">
                <p className="text-slate-100">{r.bookId?.title || "Book"}</p>
                <p className="text-slate-400">Queue: {r.queuePosition}</p>
                <p className="text-amber-300">{r.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberDashboardPage;
