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
      <h2 className="ui-title text-3xl font-semibold">Reservation Queue</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="ui-panel p-4">
            <p className="ui-title text-lg">{item.bookId?.title || "Book"}</p>
            <p className="ui-muted text-sm">Queue Position: {item.queuePosition}</p>
            <p className="mt-1 text-sm text-fuchsia-300 capitalize">{item.status}</p>
            {item.status === "active" && (
              <button
                onClick={() => cancelReservation(item._id)}
                className="mt-3 rounded-full border border-red-500/50 px-3 py-1 text-red-300"
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
