// client/src/components/BookList.tsx
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  authors: {
    id: number;
    name: string;
  }[];
  isbn?: string;
  genres?: Genre[];
  publicationYear: number;
  publisher?: string;
  coverImage?: string;
  description?: string;
}

interface Genre {
  id: number;
  name: string;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}/books`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Book[] = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch books.");
        setLoading(false);
        console.error(err); // Log the error for debugging
      }
    };

    fetchBooks();
  }, []);

  const handleEdit = (bookId: number) => {
    navigate(`/modify/${bookId}`);
  };

  const handleDelete = async (bookId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== bookId));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete book");
      }
    } catch (error) {
      setError("An error occurred while deleting the book");
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-dvh p-8 md:p-16 mt-16 md:mt-20">
      <h1 className="text-4xl font-bold mb-4">Book List</h1>

      {loading && <div>Loading books...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && books.length === 0 && (
        <div>No books available.</div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <li key={book.id} className="bg-white rounded-lg shadow p-4 relative">
            {book.coverImage && (
              <img
                referrerPolicy="no-referrer"
                src={book.coverImage}
                alt={book.title}
                className="w-full h-64 object-contain mb-4 rounded-lg"
              />
            )}
            <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-2">
              by {book.authors.map((e) => e.name).join(", ")}
            </p>
            {book.isbn && (
              <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
            )}
            <p className="text-gray-600 mb-2">
              Published: {book.publicationYear}
            </p>
            {book.publisher && (
              <p className="text-gray-600 mb-2">Publisher: {book.publisher}</p>
            )}
            {book.genres && book.genres.length > 0 && (
              <p className="text-gray-600 mb-2">
                Genres: {book.genres.map((genre) => genre.name).join(", ")}
              </p>
            )}
            {book.description && (
              <p className="text-gray-600 mb-2 line-clamp-3">
                Description: {book.description}
              </p>
            )}

            {/* Hamburger Menu */}
            <Menu
              as="div"
              className="absolute top-4 right-4 inline-block text-left"
            >
              <MenuButton className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm p-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 12h.01M12 12h.01M18 12h.01"
                  />
                </svg>
              </MenuButton>
              <MenuItems className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } group flex rounded-md items-center w-full px-4 py-2 text-sm`}
                        onClick={() => handleEdit(book.id)}
                      >
                        Edit
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } group flex rounded-md items-center w-full px-4 py-2 text-sm`}
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
