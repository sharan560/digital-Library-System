import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "../components/StatCard";
import { dashboardApi } from "../services/api";

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardApi.admin().then((res) => setData(res.data.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  const chartData = data.monthlyIssues.map((m) => ({ month: `M${m._id}`, issues: m.issues }));

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-amber-400">Admin Center</p>
        <h2 className="text-3xl font-semibold">Library Analytics</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Books" value={data.totalBooks} />
        <StatCard title="Issued Books" value={data.issuedBooks} />
        <StatCard title="Overdue" value={data.overdueBooks} />
        <StatCard title="Active Users" value={data.activeUsers} />
        <StatCard title="Fine Collected" value={`INR ${data.fineCollected}`} />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 xl:col-span-2">
          <p className="mb-3 text-lg">Monthly Issues</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="issues" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="mb-3 text-lg">Top Borrowed</p>
          <div className="space-y-2">
            {data.topBorrowed.map((book) => (
              <div key={book._id} className="rounded-lg border border-white/10 p-3">
                <p className="font-medium text-slate-100">{book.title}</p>
                <p className="text-sm text-slate-400">{book.author}</p>
                <p className="text-sm text-amber-300">Borrowed {book.borrowCount} times</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
