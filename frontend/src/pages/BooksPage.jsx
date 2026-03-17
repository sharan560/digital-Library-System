import { useEffect, useRef, useState } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import { booksApi, reservationsApi, transactionsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import useDebouncedValue from "../hooks/useDebouncedValue";

const DEFAULT_FILTERS = { q: "", genre: "", author: "", sort: "latest", availability: "" };
const isAvailabilityFilter = (value) => value === "true" || value === "false";

const BooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    totalCopies: 1,
    availableCopies: 1,
    description: "",
    coverImage: null,
  });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [searchMeta, setSearchMeta] = useState({ genres: [], authors: [], suggestions: [] });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [message, setMessage] = useState("");
  const debouncedQuery = useDebouncedValue(filters.q, 280);
  const debouncedAuthor = useDebouncedValue(filters.author, 280);
  const booksRequestRef = useRef(0);
  const searchMetaRequestRef = useRef(0);

  const activeFilterCount = [filters.q, filters.genre, filters.author, filters.availability].filter(Boolean).length;

  const fetchBooks = async (overrides = {}) => {
    const requestId = ++booksRequestRef.current;
    const requestFilters = { ...filters, ...overrides };
    const requestPage = overrides.page ?? page;
    const genreValue = (requestFilters.genre || "").trim();
    const queryValue = (overrides.q ?? debouncedQuery ?? "").trim();
    const authorValue = (overrides.author ?? debouncedAuthor ?? "").trim();
    const availabilityValue = isAvailabilityFilter(requestFilters.availability)
      ? requestFilters.availability
      : undefined;

    const params = {
      page: requestPage,
      limit: 8,
      sort: requestFilters.sort || "latest",
    };

    if (queryValue) params.q = queryValue;
    if (authorValue) params.author = authorValue;
    if (genreValue) params.genre = genreValue;
    if (availabilityValue) params.availability = availabilityValue;

    const { data } = await booksApi.list(params);

    if (requestId !== booksRequestRef.current) {
      return;
    }

    setBooks(data.data);
    setMeta(data.pagination);
  };

  const fetchSearchMeta = async () => {
    const requestId = ++searchMetaRequestRef.current;
    const { data } = await booksApi.searchMeta({ q: (debouncedQuery || "").trim() });

    if (requestId !== searchMetaRequestRef.current) {
      return;
    }

    setSearchMeta(data.data);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, debouncedAuthor, filters.genre, filters.sort, filters.availability]);

  useEffect(() => {
    if (!isAvailabilityFilter(filters.availability) && filters.availability !== "") {
      setFilters((prev) => ({ ...prev, availability: "" }));
    }
  }, [filters.availability]);

  useEffect(() => {
    fetchBooks();
  }, [page, debouncedQuery, debouncedAuthor, filters.genre, filters.sort, filters.availability]);

  useEffect(() => {
    fetchSearchMeta();
  }, [debouncedQuery]);

  const onIssue = async (bookId) => {
    try {
      await transactionsApi.issue(bookId);
      setMessage("Book issued successfully.");
      fetchBooks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not issue book.");
    }
  };

  const onReserve = async (bookId) => {
    try {
      await reservationsApi.reserve(bookId);
      setMessage("Reservation placed successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not reserve book.");
    }
  };

  const onDelete = async (bookId) => {
    await booksApi.remove(bookId);
    fetchBooks();
  };

  const resetForm = () => {
    setEditingId(null);
    setBookForm({
      title: "",
      author: "",
      genre: "",
      isbn: "",
      totalCopies: 1,
      availableCopies: 1,
      description: "",
      coverImage: null,
    });
  };

  const resetSearch = () => {
    setFilters(DEFAULT_FILTERS);
    setMessage("");
  };

  const onEdit = (book) => {
    setEditingId(book._id);
    setBookForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      description: book.description || "",
      coverImage: null,
    });
  };

  const submitBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(bookForm).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value);
    });

    try {
      if (editingId) {
        await booksApi.update(editingId, formData);
      } else {
        await booksApi.create(formData);
      }

      resetForm();
      setPage(1);
      setFilters(DEFAULT_FILTERS);
      await fetchBooks({ ...DEFAULT_FILTERS, page: 1, q: "", author: "" });
      setMessage(editingId ? "Book updated successfully." : "Book added successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save book.");
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Catalog</p>
        <h2 className="ui-title text-3xl font-semibold">Browse Collection</h2>
      </div>
      <SearchBar
        filters={filters}
        setFilters={setFilters}
        meta={searchMeta}
        totalResults={meta.total || 0}
        onReset={resetSearch}
        activeFilterCount={activeFilterCount}
      />
      {message && (
        <div className="ui-panel p-3 text-sm text-emerald-300">
          {message}
        </div>
      )}
      {user?.role === "admin" && (
        <form onSubmit={submitBook} className="ui-panel grid gap-3 p-4 md:grid-cols-4">
          <input className="ui-input" placeholder="Title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required />
          <input className="ui-input" placeholder="Author" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} required />
          <input className="ui-input" placeholder="Genre" value={bookForm.genre} onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })} required />
          <input className="ui-input" placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} required />
          <input className="ui-input" placeholder="Total copies" type="number" value={bookForm.totalCopies} onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })} required />
          <input className="ui-input" placeholder="Available copies" type="number" value={bookForm.availableCopies} onChange={(e) => setBookForm({ ...bookForm, availableCopies: e.target.value })} required />
          <input className="ui-input" placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} />
          <input className="ui-input text-sm" type="file" accept="image/*" onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.files?.[0] || null })} />
          <div className="flex gap-2 md:col-span-4">
            <button className="ui-btn-primary">{editingId ? "Update Book" : "Add Book"}</button>
            {editingId && (
              <button type="button" onClick={resetForm} className="ui-btn-secondary">Cancel</button>
            )}
          </div>
        </form>
      )}
      <div className="relative z-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book._id} book={book} onIssue={onIssue} onReserve={onReserve} onDelete={onDelete} onEdit={onEdit} isAdmin={user?.role === "admin"} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="ui-btn-secondary disabled:opacity-40">Prev</button>
        <span>{meta.total || 0} results · Page {page} / {meta.totalPages || 1}</span>
        <button disabled={page >= (meta.totalPages || 1)} onClick={() => setPage((p) => p + 1)} className="ui-btn-secondary disabled:opacity-40">Next</button>
      </div>
    </section>
  );
};

export default BooksPage;
