import { useEffect, useState } from "react";
import { reservationsApi } from "../services/api";

const ReservationsPage = () => {
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    const { data } = await reservationsApi.list();
    setItems(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cancelReservation = async (id) => {
    await reservationsApi.cancel(id);
    fetchData();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold">Reservation Queue</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-lg text-slate-100">{item.bookId?.title || "Book"}</p>
            <p className="text-sm text-slate-400">Queue Position: {item.queuePosition}</p>
            <p className="mt-1 text-sm text-amber-300 capitalize">{item.status}</p>
            {item.status === "active" && (
              <button
                onClick={() => cancelReservation(item._id)}
                className="mt-3 rounded border border-red-500/50 px-3 py-1 text-red-300"
              >
                Cancel
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ReservationsPage;
