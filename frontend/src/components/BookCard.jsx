import { motion } from "framer-motion";
import { BookUp2, BookmarkPlus, LibraryBig } from "lucide-react";

const BookCard = ({ book, onIssue, onReserve, isAdmin, onDelete, onEdit }) => {
  const imageSrc = book.coverImage
    ? `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}${book.coverImage}`
    : "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-xl"
    >
      <img src={imageSrc} alt={book.title} className="h-44 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-100">{book.title}</h3>
          <p className="text-sm text-slate-400">{book.author}</p>
        </div>
        <p className="line-clamp-2 text-sm text-slate-300">{book.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{book.genre}</span>
          <span>{book.availableCopies} available</span>
        </div>
        <div className="flex gap-2">
          {book.availability ? (
            <button
              onClick={() => onIssue(book._id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-sm font-medium text-slate-950"
            >
              <BookUp2 size={14} /> Borrow
            </button>
          ) : (
            <button
              onClick={() => onReserve(book._id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-100"
            >
              <BookmarkPlus size={14} /> Reserve
            </button>
          )}
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(book)}
                className="rounded-lg border border-sky-500/50 px-3 py-2 text-sm text-sky-300"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(book._id)}
                className="rounded-lg border border-red-500/50 px-3 py-2 text-sm text-red-300"
              >
                Delete
              </button>
            </>
          )}
          {!isAdmin && (
            <div className="grid place-items-center rounded-lg border border-white/10 px-3 py-2 text-slate-300">
              <LibraryBig size={14} />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default BookCard;
