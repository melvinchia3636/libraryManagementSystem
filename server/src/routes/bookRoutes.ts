import express from "express";
import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";

const router = express.Router();
const prisma = new PrismaClient();

const cache = new Map();

// GET /books (Fetch all books)
router.get("/", async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: { genres: true, authors: true },
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: { genres: true, authors: true },
    });
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

// POST /books (Create a new book)
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("authors").notEmpty().isArray().withMessage("Authors is required"),
    body("publicationYear")
      .isNumeric()
      .withMessage("Publication Year must be a number"),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      authors,
      isbn,
      genres,
      publicationYear,
      publisher,
      coverImage,
      pageCount,
      language,
      description,
    }: {
      title: string;
      authors: string[];
      genres: string[];
      isbn: string;
      publicationYear: string;
      publisher: string;
      coverImage: string;
      pageCount: number;
      language: string;
      description: string;
    } = req.body;

    try {
      const existedBook = await prisma.book.findFirst({
        where: { isbn },
      });

      if (existedBook) {
        return res.status(400).json({ error: "Book already exists." });
      }

      const existedGenres = await prisma.genre.findMany({
        where: { name: { in: genres } },
      });

      const genreIds = existedGenres.map((genre) => genre.id);

      const newGenres = genres.filter(
        (genre) => !existedGenres.find((g) => g.name === genre)
      );

      for (const genre of newGenres) {
        const newGenre = await prisma.genre.create({
          data: {
            name: genre,
          },
        });
        genreIds.push(newGenre.id);
      }

      const existedAuthors = await prisma.author.findMany({
        where: { name: { in: authors } },
      });

      const authorIds = existedAuthors.map((author) => author.id);

      const newAuthors = authors.filter(
        (author) => !existedAuthors.find((a) => a.name === author)
      );

      for (const author of newAuthors) {
        const newAuthor = await prisma.author.create({
          data: {
            name: author,
          },
        });
        authorIds.push(newAuthor.id);
      }

      const book = await prisma.book.create({
        data: {
          title,
          authors: {
            connect: authorIds.map((id) => ({ id })),
          },
          isbn,
          genres: {
            connect: genreIds.map((id) => ({ id })),
          },
          publicationYear: parseInt(publicationYear),
          publisher,
          coverImage,
          pageCount,
          language,
          description,
        },
      });

      res.status(201).json(book);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create book." });
    }
  }
);

// PUT /books/:id (Update a specific book)
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("Invalid book ID"),
    body("title").notEmpty().withMessage("Title is required"),
    body("authors").notEmpty().isArray().withMessage("Authors is required"),
    body("publicationYear")
      .isNumeric()
      .withMessage("Publication Year must be a number"),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      title,
      authors,
      isbn,
      genres,
      publicationYear,
      publisher,
      coverImage,
      pageCount,
      language,
      description,
    }: {
      title: string;
      authors: string[];
      genres: string[];
      isbn: string;
      publicationYear: string;
      publisher: string;
      coverImage: string;
      pageCount: number;
      language: string;
      description: string;
    } = req.body;

    try {
      const existedBook = await prisma.book.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existedBook) {
        return res.status(404).json({ error: "Book not found." });
      }

      const existedGenres = await prisma.genre.findMany({
        where: { name: { in: genres } },
      });

      const genreIds = existedGenres.map((genre) => genre.id);

      const newGenres = genres.filter(
        (genre) => !existedGenres.find((g) => g.name === genre)
      );

      for (const genre of newGenres) {
        const newGenre = await prisma.genre.create({
          data: {
            name: genre,
          },
        });
        genreIds.push(newGenre.id);
      }

      const existedAuthors = await prisma.author.findMany({
        where: { name: { in: authors } },
      });

      const authorIds = existedAuthors.map((author) => author.id);

      const newAuthors = authors.filter(
        (author) => !existedAuthors.find((a) => a.name === author)
      );

      for (const author of newAuthors) {
        const newAuthor = await prisma.author.create({
          data: {
            name: author,
          },
        });
        authorIds.push(newAuthor.id);
      }

      const book = await prisma.book.update({
        where: { id: parseInt(id) },
        data: {
          title,
          authors: {
            set: authorIds.map((id) => ({ id })),
          },
          isbn,
          genres: {
            set: genreIds.map((id) => ({ id })),
          },
          publicationYear: parseInt(publicationYear),
          publisher,
          coverImage,
          pageCount,
          language,
          description,
        },
      });

      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to update book." });
    }
  }
);

// DELETE /books/:id (Delete a specific book)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book." });
  }
});

router.get(
  "/isbn-query/:isbn",
  [param("isbn").isISBN().withMessage("Invalid ISBN")],
  async (req: express.Request, res: express.Response) => {
    const { isbn } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array });
    }

    let headers = {
      "Content-Type": "application/json",
      Authorization: process.env.ISBNDB_API_KEY || "",
    };

    if (cache.has(isbn)) {
      return res.status(200).json(cache.get(isbn));
    }

    fetch("https://api2.isbndb.com/book/" + isbn, { headers: headers })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.errorMessage !== "Not Found") {
          res.status(200).json(json);
          cache.set(isbn, json);
          return;
        }

        fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if (json.totalItems === 0) {
              res.status(404).json({ error: "Book not found." });
              return;
            }

            const data = json.items[0].volumeInfo;

            const final = {
              book: {
                title: data.title,
                authors: data.authors ?? [],
                publisher: data.publisher,
                date_published: data.publishedDate,
                pages: data.pageCount,
                language: data.language,
                subjects: [],
              },
            };

            res.status(200).json(final);
            cache.set(isbn, final);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
);

export default router;
