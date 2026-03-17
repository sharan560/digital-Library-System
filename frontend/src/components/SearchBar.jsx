import { Search, Sparkles, X } from "lucide-react";

const SearchBar = ({ filters, setFilters, meta, totalResults, onReset, activeFilterCount }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="ui-panel relative z-40 space-y-4 p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-400">
            <Sparkles size={14} /> Discovery Search
          </p>
          <p className="ui-muted text-sm">{totalResults} matching books with live suggestions, filters, and smart sorting.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-cyan-300">
            {activeFilterCount} active filters
          </span>
          <button type="button" onClick={onReset} className="ui-btn-secondary inline-flex items-center gap-2">
            <X size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
        <div className="relative z-50">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/80"
          />
          <input
            placeholder="Search title, author, ISBN, genre..."
            value={filters.q}
            onChange={(e) => update("q", e.target.value)}
            className="ui-input h-12 w-full placeholder:text-slate-400"
            style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
          />
          {filters.q && meta?.suggestions?.length > 0 && (
            <div className="absolute z-[100] mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur">
              {meta.suggestions.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => update("q", item.title)}
                  className="flex w-full items-start justify-between rounded-xl px-3 py-2 text-left hover:bg-white/10"
                >
                  <span>
                    <span className="block text-sm text-white">{item.title}</span>
                    <span className="block text-xs text-slate-400">{item.author} · {item.genre}</span>
                  </span>
                  <span className={`rounded-full px-2 py-1 text-[10px] ${item.availability ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                    {item.availability ? "Available" : "Queued"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          placeholder="Filter by author"
          value={filters.author}
          onChange={(e) => update("author", e.target.value)}
          className="ui-input"
        />
        <select value={filters.genre} onChange={(e) => update("genre", e.target.value)} className="ui-input">
          <option value="">All genres</option>
          {meta?.genres?.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <select value={filters.sort} onChange={(e) => update("sort", e.target.value)} className="ui-input">
          <option value="latest">Latest</option>
          <option value="popularity">Popularity</option>
          <option value="alphabetical">A-Z</option>
        </select>
        <select
          value={filters.availability}
          onChange={(e) => {
            const nextValue = e.target.value;
            update("availability", nextValue === "true" || nextValue === "false" ? nextValue : "");
          }}
          className="ui-input"
        >
          <option value="">All stock</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {meta?.genres?.slice(0, 5).map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => update("genre", genre)}
            className={`rounded-full border px-3 py-1.5 text-xs ${filters.genre === genre ? "border-cyan-300 bg-cyan-400/15 text-cyan-300" : "border-white/10 text-slate-300 hover:bg-white/10"}`}
          >
            {genre}
          </button>
        ))}
        {meta?.authors?.slice(0, 3).map((author) => (
          <button
            key={author}
            type="button"
            onClick={() => update("author", author)}
            className={`rounded-full border px-3 py-1.5 text-xs ${filters.author === author ? "border-fuchsia-300 bg-fuchsia-400/15 text-fuchsia-300" : "border-white/10 text-slate-300 hover:bg-white/10"}`}
          >
            {author}
          </button>
        ))}
      </div>
    </section>
  );
};

export default SearchBar;
