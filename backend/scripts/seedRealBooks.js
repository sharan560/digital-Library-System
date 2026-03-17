const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Book = require("../src/models/Book");

dotenv.config();

const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json";
const SUBJECTS = [
  "fiction",
  "history",
  "science",
  "technology",
  "philosophy",
  "biography",
  "literature",
  "psychology",
  "economics",
  "world"
];

const toCoverUrl = (doc) => {
  if (Array.isArray(doc.isbn) && doc.isbn.length > 0) {
    return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
  }

  if (doc.cover_i) {
    return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
  }

  return "";
};

const toBookDoc = (doc, index) => {
  const isbn = Array.isArray(doc.isbn) && doc.isbn.length > 0
    ? doc.isbn[0]
    : `NOISBN-${Date.now()}-${index}`;

  return {
    title: doc.title || `Untitled Book ${index + 1}`,
    author: Array.isArray(doc.author_name) && doc.author_name.length > 0 ? doc.author_name[0] : "Unknown Author",
    genre: Array.isArray(doc.subject) && doc.subject.length > 0 ? doc.subject[0] : "General",
    isbn,
    description: `Imported from Open Library (${doc.first_publish_year || "Unknown year"})`,
    totalCopies: 5,
    availableCopies: 5,
    availability: true,
    coverImage: toCoverUrl(doc),
    borrowCount: 0,
  };
};

const fetchBooks = async () => {
  const allDocs = [];

  for (const subject of SUBJECTS) {
    const url = `${OPEN_LIBRARY_SEARCH}?q=${encodeURIComponent(subject)}&language=eng&has_fulltext=true&limit=12`;
    const response = await fetch(url);

    if (!response.ok) {
      continue;
    }

    const payload = await response.json();
    const docs = Array.isArray(payload.docs) ? payload.docs : [];
    allDocs.push(...docs);

    if (allDocs.length >= 70) {
      break;
    }
  }

  return allDocs;
};

const seedRealBooks = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const rawDocs = await fetchBooks();
    const transformed = rawDocs.map(toBookDoc);

    // Keep unique ISBNs only and require cover image + title + author.
    const unique = [];
    const seen = new Set();

    for (const item of transformed) {
      if (!item.coverImage || !item.title || !item.author || !item.isbn) {
        continue;
      }

      const key = String(item.isbn).trim();
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      unique.push(item);

      if (unique.length === 20) {
        break;
      }
    }

    if (unique.length < 20) {
      throw new Error(`Could only find ${unique.length} books with covers. Try re-running.`);
    }

    await Book.deleteMany({ title: /^Sample Book\s\d+$/i });
    const inserted = await Book.insertMany(unique, { ordered: false });

    console.log(`Inserted real books: ${inserted.length}`);
    console.log("Examples:", inserted.slice(0, 5).map((b) => ({ title: b.title, author: b.author, coverImage: b.coverImage })));
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedRealBooks();
