import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import { booksApi, reservationsApi, transactionsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
  const [filters, setFilters] = useState({ q: "", genre: "", author: "", sort: "latest", availability: "" });

  const fetchBooks = async () => {
    const { data } = await booksApi.list({ ...filters, page, limit: 8 });
    setBooks(data.data);
    setMeta(data.pagination);
  };

  useEffect(() => {
    fetchBooks();
  }, [page, filters.q, filters.genre, filters.author, filters.sort, filters.availability]);

  const onIssue = async (bookId) => {
    await transactionsApi.issue(bookId);
    fetchBooks();
  };

  const onReserve = async (bookId) => {
    await reservationsApi.reserve(bookId);
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
        <p className="text-sm uppercase tracking-[0.2em] text-amber-400">Catalog</p>
        <h2 className="text-3xl font-semibold">Browse Collection</h2>
      </div>
      <SearchBar filters={filters} setFilters={setFilters} />
      {user?.role === "admin" && (
        <form onSubmit={submitBook} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:grid-cols-4">
          <input className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2" placeholder="Title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required />
          <input className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2" placeholder="Author" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} required />
          <input className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2" placeholder="Genre" value={bookForm.genre} onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })} required />
          <input className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2" placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} required />
          <input className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2" placeholder="Total copies" type="number" value={bookForm.totalCopies} onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })} required />
          <input className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2" placeholder="Available copies" type="number" value={bookForm.availableCopies} onChange={(e) => setBookForm({ ...bookForm, availableCopies: e.target.value })} required />
          <input className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2" placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} />
          <input className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm" type="file" accept="image/*" onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.files?.[0] || null })} />
          <div className="flex gap-2 md:col-span-4">
            <button className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-900">{editingId ? "Update Book" : "Add Book"}</button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-lg border border-white/20 px-4 py-2">Cancel</button>
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
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-white/20 px-4 py-2 disabled:opacity-40">Prev</button>
        <span>Page {page} / {meta.totalPages || 1}</span>
        <button disabled={page >= (meta.totalPages || 1)} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-white/20 px-4 py-2 disabled:opacity-40">Next</button>
      </div>
    </section>
  );
};

export default BooksPage;
