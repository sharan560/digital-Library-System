const SearchBar = ({ filters, setFilters }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:grid-cols-5">
      <input
        placeholder="Search title, author, genre..."
        value={filters.q}
        onChange={(e) => update("q", e.target.value)}
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-400"
      />
      <input
        placeholder="Author"
        value={filters.author}
        onChange={(e) => update("author", e.target.value)}
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-400"
      />
      <input
        placeholder="Genre"
        value={filters.genre}
        onChange={(e) => update("genre", e.target.value)}
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-400"
      />
      <select
        value={filters.sort}
        onChange={(e) => update("sort", e.target.value)}
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-400"
      >
        <option value="latest">Latest</option>
        <option value="popularity">Popularity</option>
        <option value="alphabetical">A-Z</option>
      </select>
      <select
        value={filters.availability}
        onChange={(e) => update("availability", e.target.value)}
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-400"
      >
        <option value="">All</option>
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>
    </section>
  );
};

export default SearchBar;
