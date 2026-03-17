import { motion } from "framer-motion";
import { BookUp2, BookmarkPlus, LibraryBig } from "lucide-react";

const BookCard = ({ book, onIssue, onReserve, isAdmin, onDelete, onEdit }) => {
  const apiHost = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";
  const isExternalImage = /^https?:\/\//i.test(book.coverImage || "");
  const imageSrc = book.coverImage
    ? isExternalImage
      ? book.coverImage
      : `${apiHost}${book.coverImage}`
    : "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="ui-panel overflow-hidden shadow-xl"
    >
      <img src={imageSrc} alt={book.title} className="h-40 w-full object-cover saturate-125 sm:h-44" />
      <div className="space-y-3 p-4">
        <div>
          <h3 className="ui-title line-clamp-1 text-lg font-semibold">{book.title}</h3>
          <p className="ui-muted text-sm">{book.author}</p>
        </div>
        <p className="ui-muted line-clamp-2 text-sm">{book.description}</p>
        <div className="ui-muted flex items-center justify-between text-xs">
          <span>{book.genre}</span>
          <span>{book.availableCopies} available</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {book.availability ? (
            <button
              onClick={() => onIssue(book._id)}
              className="flex min-w-[130px] flex-1 items-center justify-center gap-2 rounded-lg bg-lime-300 px-3 py-2 text-sm font-semibold text-slate-900"
            >
              <BookUp2 size={14} /> Borrow
            </button>
          ) : (
            <button
              onClick={() => onReserve(book._id)}
              className="flex min-w-[130px] flex-1 items-center justify-center gap-2 rounded-lg border border-fuchsia-300/40 bg-fuchsia-500/20 px-3 py-2 text-sm text-white"
            >
              <BookmarkPlus size={14} /> Reserve
            </button>
          )}
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(book)}
                className="rounded-lg border border-cyan-400/40 px-3 py-2 text-sm text-cyan-300"
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
            <div className="grid place-items-center rounded-lg border border-white/20 px-3 py-2 text-slate-200">
              <LibraryBig size={14} />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default BookCard;
