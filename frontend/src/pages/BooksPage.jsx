import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import { booksApi, reservationsApi, transactionsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import useDebouncedValue from "../hooks/useDebouncedValue";

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
  const [filters, setFilters] = useState({ q: "", genre: "", author: "", sort: "latest", availability: "" });
  const [message, setMessage] = useState("");
  const debouncedQuery = useDebouncedValue(filters.q, 280);
  const debouncedAuthor = useDebouncedValue(filters.author, 280);

  const activeFilterCount = [filters.q, filters.genre, filters.author, filters.availability].filter(Boolean).length;

  const fetchBooks = async () => {
    const { data } = await booksApi.list({ ...filters, q: debouncedQuery, author: debouncedAuthor, page, limit: 8 });
    setBooks(data.data);
    setMeta(data.pagination);
  };

  const fetchSearchMeta = async () => {
    const { data } = await booksApi.searchMeta({ q: debouncedQuery });
    setSearchMeta(data.data);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, debouncedAuthor, filters.genre, filters.sort, filters.availability]);

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
    setFilters({ q: "", genre: "", author: "", sort: "latest", availability: "" });
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

    if (editingId) {
      await booksApi.update(editingId, formData);
    } else {
      await booksApi.create(formData);
    }

    resetForm();
    fetchBooks();
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
